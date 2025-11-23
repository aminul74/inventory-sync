import { Box, Text } from "@shopify/polaris";

const Footer = () => {
    return (
        <Box as="div" padding="400">
            <Text as="p" variant="bodySm" alignment="center">
                &copy; {new Date().getFullYear()} Aminul. All rights reserved.
            </Text>
        </Box>
    );
};

export default Footer;
