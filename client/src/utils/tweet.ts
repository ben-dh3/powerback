import { Celebration } from '@Types';

const TWITTER_CTA = '! Find out at @PowerbackApp',
  BILL_SHORT_TITLE_CHAR_LIMIT = 30,
  PB_TCO_URI = 'https://powerback.me',
  TWITTER_URI = 'https://twitter.com/intent/tweet?',
  TWITTER_HASHTAGS =
    'NoDonationWithoutRepresentation,NoRepGetStepped,TakeThePowerBack',
  TWITTER_TEXT =
    "I just made a campaign donation that you can't cash until action is taken on ",
  EXT_URI_SETTINGS =
    'toolbar=yes,location=yes,status=no,menubar=yes,scrollbars=yes,resizable=yes,width=420,height=420';

type Props = {
  bill_id: string;
  short_title: string;
};

export const tweetDonation = (
  { bill_id, short_title }: Props,
  celebration: Celebration
) => {
  return window.open(
    TWITTER_URI +
      '&hashtags=' +
      TWITTER_HASHTAGS +
      (celebration.twitter && celebration.twitter !== ''
        ? '&screen_name=' + celebration.twitter
        : '') +
      '&text=' +
      TWITTER_TEXT +
      bill_id +
      ((short_title.length <= BILL_SHORT_TITLE_CHAR_LIMIT &&
        ', ' + short_title) ||
        '') +
      TWITTER_CTA +
      '&url=' +
      PB_TCO_URI,
    '__blank',
    EXT_URI_SETTINGS
  );
};
