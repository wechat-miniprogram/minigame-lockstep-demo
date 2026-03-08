import { showTip } from '../common/util.js';
import { themedText } from '../theme.js';

class RewardedAdService {
    constructor() {
        this.ad = null;
        this.adUnitId = '';
    }

    supported() {
        return typeof wx !== 'undefined' && !!wx.createRewardedVideoAd;
    }

    ensure(adUnitId) {
        if (!this.supported()) {
            return false;
        }

        if (!adUnitId) {
            return false;
        }

        if (this.ad && this.adUnitId === adUnitId) {
            return true;
        }

        try {
            this.ad = wx.createRewardedVideoAd({ adUnitId });
            this.adUnitId = adUnitId;
            return true;
        } catch (e) {
            this.ad = null;
            this.adUnitId = '';
            return false;
        }
    }

    show(options = {}) {
        const {
            adUnitId,
            onReward,
            onSkip,
            onFail,
        } = options;

        if (!this.ensure(adUnitId)) {
            onFail && onFail({ reason: 'unsupported_or_missing_adunit' });
            return Promise.resolve({ shown: false, rewarded: false, reason: 'unsupported_or_missing_adunit' });
        }

        const ad = this.ad;

        return new Promise((resolve) => {
            let settled = false;

            const finish = (result) => {
                if (settled) return;
                settled = true;

                if (ad.offClose) ad.offClose(handleClose);
                if (ad.offError) ad.offError(handleError);

                resolve(result);
            };

            const handleClose = (res) => {
                const rewarded = !!(res && res.isEnded);
                if (rewarded) {
                    onReward && onReward();
                } else {
                    onSkip && onSkip();
                }
                finish({ shown: true, rewarded, reason: rewarded ? 'rewarded' : 'skipped' });
            };

            const handleError = (err) => {
                onFail && onFail({ reason: 'ad_error', err });
                finish({ shown: false, rewarded: false, reason: 'ad_error', err });
            };

            ad.onClose(handleClose);
            ad.onError(handleError);

            ad.load()
                .then(() => ad.show())
                .catch((err) => {
                    showTip(themedText('ad.loadingFailed', '广告加载失败，请稍后重试'));
                    onFail && onFail({ reason: 'load_or_show_failed', err });
                    finish({ shown: false, rewarded: false, reason: 'load_or_show_failed', err });
                });
        });
    }
}

export default new RewardedAdService();
