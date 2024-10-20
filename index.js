const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const {config} = require("dotenv")

config()

const s3Client = new S3Client({
	credentials: {
		accessKeyId: process.env.AWS_KEY_ID,
		secretAccessKey: process.env.AWS_KEY_SECRET
	},
	region: process.env.AWS_REGION
})


// reqMethod {put, delete}
async function getObjectUrl(objectKey, requestMethod) {
	const commandMapping = {
		put: PutObjectCommand,
		delete: DeleteObjectCommand
	}
	const Command = commandMapping[requestMethod]
	const commandToExecuted = new Command({
		Bucket: process.env.AWS_BUCKET,
		Key: objectKey
	})

	const objectUrl = await getSignedUrl(s3Client, commandToExecuted)
	return objectUrl
}

getObjectUrl("Finance.svg", "put").then(console.log)