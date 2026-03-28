import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/portal/", "/auth/", "/checkout/", "/api/"],
            },
        ],
        sitemap: "https://flarecross.com/sitemap.xml",
    };
}
