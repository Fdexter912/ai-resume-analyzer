export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        // Render all pages to individual canvases
        const canvases: HTMLCanvasElement[] = [];
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 4 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            if (context) {
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
            }

            await page.render({ canvasContext: context!, viewport }).promise;
            canvases.push(canvas);
        }

        // Stitch all page canvases into one tall canvas
        const totalWidth = canvases[0].width;
        const totalHeight = canvases.reduce((sum, c) => sum + c.height, 0);

        const stitched = document.createElement("canvas");
        stitched.width = totalWidth;
        stitched.height = totalHeight;
        const stitchedCtx = stitched.getContext("2d");

        let yOffset = 0;
        for (const canvas of canvases) {
            stitchedCtx!.drawImage(canvas, 0, yOffset);
            yOffset += canvas.height;
        }

        return new Promise((resolve) => {
            stitched.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });
                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}