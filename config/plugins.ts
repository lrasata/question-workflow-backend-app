export default ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3', // used as a storage on deployment.
            providerOptions: {
                s3Options: {
                    accessKeyId: env('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: env('AWS_ACCESS_SECRET'),
                    region: env('AWS_REGION'),
                    params: {
                        Bucket: env('AWS_BUCKET_NAME'),
                    },
                }
            },
        },
    }
});