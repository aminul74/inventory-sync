import { Card, Page, Text, Icon, Box } from '@shopify/polaris';
import { AlertCircleIcon } from '@shopify/polaris-icons';

export default function ErrorPage({ errorMessage }: { errorMessage: string }) {
  return (
    <Page narrowWidth>
        <Card>
            <Icon source={AlertCircleIcon} tone="critical" />
            <Box as='div' padding="400">
                <div style={{ textAlign: 'center' }}>
                    <Text as="h2" variant="headingMd" tone="critical">
                    Something went wrong
                    </Text>
                    <Text as="p" tone="subdued">
                    {errorMessage}
                    </Text>
                </div>
            </Box>
        </Card>
    </Page>
  );
}
