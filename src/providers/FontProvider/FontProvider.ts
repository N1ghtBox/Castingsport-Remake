import { Font } from "@react-pdf/renderer";

class FontProvider {
    static RegisterFonts() {
        Font.registerHyphenationCallback((word) => [word]);
        // Register Font
        Font.register({
            family: "Roboto",
            fonts: [
                {
                    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
                    fontWeight: "normal",
                },
                {
                    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
                    fontWeight: "bold",
                },
                {
                    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
                    fontStyle: "italic",
                },
            ],
        });
    }
}

export default FontProvider;