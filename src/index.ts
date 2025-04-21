import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient();

function detectFace(fileName: string) {
    console.log(`Running logo detection on ${fileName}`);
    client.logoDetection(fileName)
    .then(([result]) => {
        let scores: number[] = [];       
        const logos = result.logoAnnotations;
        logos?.forEach((logo) => {
            if (logo.description)
                console.log(`"${logo.description}" found in in file ${fileName}`);
            if (logo.score)
                scores.push(logo.score);
        });
        const avg = scores.reduce((a, b) => a + b) / scores.length;
        console.log(`Average score for ${fileName}: ${avg}`);
    })
    .catch((err) => {
        if (err.code === 'ENOENT')
            console.log(`File ${fileName} not found`);
    });
}

/**
 * Runs logo detection on the given list of file names and logs the description and average score of each logo.
 * @param fileNames - An array of file names to run logo detection on.
 * @returns void
 */
function main (fileNames: string[]): void {
    fileNames.forEach((fileName: string) => {
        console.log(`Running logo detection on ${fileName}`);
        client.logoDetection(fileName)
        .then(([result]) => {
            let scores: number[] = [];
            const logos = result.logoAnnotations;
            logos?.forEach((logo) => {
                if (logo.description)
                    console.log(`"${logo.description}" found in in file ${fileName}`);
                if (logo.score)
                    scores.push(logo.score);
            });
            const avg = scores.reduce((a, b) => a + b) / scores.length;
            console.log(`Average score for ${fileName}: ${avg}`);
        })
        .catch((err) => {
            if (err.code === 'ENOENT')
                console.log(`File ${fileName} not found`);
        });
    });
}

// Implement the async version of the above here
// Your version should not use .then and should use try/catch instead of .catch
async function mainAsync(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
        try {
            console.log(`Running logo detection on ${fileName}`);
            const [result] = await client.logoDetection(fileName); // Using await to handle async result
            let scores: number[] = [];
            const logos = result.logoAnnotations;

            if (logos) {
                logos.forEach((logo) => {
                    if (logo.description) {
                        console.log(`"${logo.description}" found in in file ${fileName}`);
                    }
                    if (logo.score) {
                        scores.push(logo.score);
                    }
                });

                if (scores.length > 0) {
                    const avg = scores.reduce((a, b) => a + b) / scores.length;
                    console.log(`Average score for ${fileName}: ${avg}`);
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                // Хэрвээ err нь NodeJS-ийн алдаа бол
                const anyErr = err as NodeJS.ErrnoException;
                if (anyErr.code === 'ENOENT') {
                    console.log(`File ${fileName} not found`);
                } else {
                    console.log(`Error processing ${fileName}: ${anyErr.message}`);
                }
            } else {
                console.log(`Unknown error occurred for ${fileName}`);
            }
        }
        
    }
}

main([
    './images/cmu.jpg', 
    './images/logo-types-collection.jpg', 
    './images/not-a-file.jpg'
]);

mainAsync([
    './images/cmu.jpg', 
    './images/logo-types-collection.jpg', 
    './images/not-a-file.jpg'
]);
