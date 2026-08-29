package com.example.backend.Utils;


import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;

public class XssUtil {

    private static final PolicyFactory POLICY =
            new HtmlPolicyBuilder().toFactory();

    private XssUtil() {
        // Prevent instantiation
    }

    public static String sanitize(String input) {
        if (input == null) {
            return null;
        }
        return POLICY.sanitize(input);
    }
}
