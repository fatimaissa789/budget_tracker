export const Currencies = [
    {
        value: "XOF", label: "Franc CFA", locale: "fr-SN"
    },
    { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
    { value: "GBP", label: "£ Pound", locale: "en-GB" },
];

export type Currency = (typeof Currencies)[0];
