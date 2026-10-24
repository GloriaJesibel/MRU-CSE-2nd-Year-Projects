package com.homeremedyhub.homeremedyhub.service;

import java.io.StringReader;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

@Service
public class MedlinePlusService {

    private final RestTemplate restTemplate =
            new RestTemplate();


    public Map<String, String> searchHealthTopic(
            String symptom) {

        Map<String, String> result =
                new LinkedHashMap<>();

        try {

            String encodedSymptom =
                    URLEncoder.encode(
                            symptom,
                            StandardCharsets.UTF_8
                    );


            String url =
                    "https://wsearch.nlm.nih.gov/ws/query"
                    + "?db=healthTopics"
                    + "&term=" + encodedSymptom
                    + "&retmax=1"
                    + "&tool=HomeRemedyHub";


            String xml =
                    restTemplate.getForObject(
                            URI.create(url),
                            String.class
                    );


            if (xml == null || xml.isBlank()) {

                result.put(
                        "message",
                        "No MedlinePlus information found."
                );

                return result;
            }


            /* =========================================
               PARSE XML
            ========================================= */

            DocumentBuilderFactory factory =
                    DocumentBuilderFactory
                            .newInstance();


            factory.setFeature(
                    "http://apache.org/xml/features/disallow-doctype-decl",
                    true
            );


            DocumentBuilder builder =
                    factory.newDocumentBuilder();


            Document document =
                    builder.parse(
                            new InputSource(
                                    new StringReader(xml)
                            )
                    );


            NodeList documents =
                    document.getElementsByTagName(
                            "document"
                    );


            if (documents.getLength() == 0) {

                result.put(
                        "message",
                        "No MedlinePlus information found."
                );

                return result;
            }


            Element firstDocument =
                    (Element) documents.item(0);


            NodeList contents =
                    firstDocument.getElementsByTagName(
                            "content"
                    );


            String title = "";
            String summary = "";
            String organization = "";
            String link =
                    firstDocument.getAttribute("url");


            for (int i = 0;
                 i < contents.getLength();
                 i++) {

                Element content =
                        (Element) contents.item(i);


                String name =
                        content.getAttribute("name");


                String value =
                        cleanText(
                                content.getTextContent()
                        );


                if (
                    name.equalsIgnoreCase("title")
                ) {

                    title = value;

                }

                else if (
                    name.equalsIgnoreCase(
                            "FullSummary"
                    )
                ) {

                    summary = value;

                }

                else if (
                    name.equalsIgnoreCase(
                            "organizationName"
                    )
                ) {

                    organization = value;

                }

            }


            result.put(
                    "searchTerm",
                    symptom
            );

            result.put(
                    "title",
                    title
            );

            result.put(
                    "summary",
                    summary
            );

            result.put(
                    "organization",
                    organization
            );

            result.put(
                    "source",
                    "MedlinePlus.gov"
            );

            result.put(
                    "url",
                    link
            );


            return result;

        }

        catch (Exception e) {

            e.printStackTrace();

            result.put(
                    "message",
                    "Unable to retrieve MedlinePlus information."
            );

            return result;
        }

    }


    /* =============================================
       REMOVE HTML TAGS
    ============================================= */

    private String cleanText(
            String text) {

        if (text == null) {

            return "";
        }


        return text
                .replaceAll(
                        "<[^>]*>",
                        " "
                )
                .replace("&nbsp;", " ")
                .replace("&amp;", "&")
                .replace("&quot;", "\"")
                .replace("&#39;", "'")
                .replaceAll(
                        "\\s+",
                        " "
                )
                .trim();
    }
}