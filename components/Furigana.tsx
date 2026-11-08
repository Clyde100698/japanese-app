interface Props {
  text: string;
  reading?: string;
  show: boolean;
  big?: boolean;
}

/** Text with an optional kana reading above it (ruby). The reading is hidden when `show` is false. */
export default function Furigana({ text, reading, show, big }: Props) {
  const size = big ? (text.length > 6 ? "text-3xl" : "text-7xl") : "text-2xl";
  if (reading && reading !== text) {
    return (
      <ruby className={`${size} font-medium leading-tight`} lang="ja">
        {text}
        <rp>(</rp>
        <rt className={`${show ? "" : "invisible"} text-base text-slate-500`}>{reading}</rt>
        <rp>)</rp>
      </ruby>
    );
  }
  return <span className={`${size} font-medium leading-tight`} lang="ja">{text}</span>;
}

