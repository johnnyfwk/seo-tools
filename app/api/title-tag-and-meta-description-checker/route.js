import { getRedirects } from "@/app/lib/utils/getRedirects";
import { checkRobotsTxt } from "@/app/lib/utils/checkRobotsTxt";
import { scrapeWithCheerio } from "@/app/lib/scrapers";
import { fetchResource } from "@/app/lib/utils/fetchResource";
import * as utils from '@/app/lib/utils/utils';

export async function POST(request) {
    try {
        const {
            enteredUrl,
            scrapeEvenIfBlocked,
            scrapeOptions = {
                all: false,
                titleTags: true,
                metaDescriptions: true,
            }
        } = await request.json();

        const {
            valid,
            error,
            url: normalisedUrl
        } = utils.validateUrlBackend(enteredUrl);

        if (!valid) {
            return Response.json(
                { error },
                { status: 400 }
            );
        }

        let redirectData;
        try {
            redirectData = await getRedirects(normalisedUrl);
        } catch (err) {
            return Response.json(
                {
                    error: "Failed to fetch URL (redirect resolution failed)",
                    details: err.message,
                },
                { status: 400 },
            )
        }

        const {
            initialUrlStatusCode,
            finalUrl,
            finalUrlStatusCode,
            redirects
        } = redirectData;

        const robotsTxt = await checkRobotsTxt(finalUrl);

        let resource = {
            headers: {},
            data: null,
            exists: false,
            contentType: null,
            isHtml: false,
            isPdf: false,
            isImage: false,
            isCss: false,
            isJs: false,
            isOther: false
        };

        if (!robotsTxt.blocked || scrapeEvenIfBlocked) {
            try {
                resource = await fetchResource(
                    finalUrl,
                    scrapeOptions,
                    scrapeWithCheerio,
                );

            } catch (err) {
                return Response.json(
                    {
                        error: "Failed to fetch the target page.",
                        details: err.message
                    },
                    { status: 400 }
                );
            }
        }

        return Response.json({
            enteredUrl: normalisedUrl,
            enteredUrlStatusCode: initialUrlStatusCode,
            finalUrl,
            finalUrlStatusCode,
            redirects,
            robotsTxt,
            resource,
            scrapedData: resource.data,
        })

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal Server Error", details: err.message },
            { status: 500 }
        );
    }
}