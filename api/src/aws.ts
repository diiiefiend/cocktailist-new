import { S3Client, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Model } from 'sequelize';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_ACCESS_SECRET || '',
    }
})

// overly convoluted filepath thanks to not knowing what i was doing in 2015
const AWS_SUBDIR_PATH = 'cocktails/imgs/000/000';

// fileName should be something like "[cocktailId]/{original|small}/cocktail_name.jpg"
const uploadImage = async (fileName: string, imageBlob: any) => {
  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${AWS_SUBDIR_PATH}/${fileName}`,
      Body: imageBlob, 
    };

    // Upload the file to S3
    const response = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`uploaded image: ${process.env.AWS_BUCKET}:${AWS_SUBDIR_PATH}/${fileName}`);

    return response;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

const isFileAvailableInBucket = async (fileName: string) => {
  try {
    console.info(`img lookup: ${process.env.AWS_BUCKET}:${AWS_SUBDIR_PATH}/${fileName}`);
  
    // Check if the object exists
    await s3Client.send(new HeadObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: `${AWS_SUBDIR_PATH}/${fileName}`,
    }));

    return true;
  } catch (err) {
    // console.error(err);
    return false;
  }
}

const getImageUrl = async (fileName: string) => {
  try {
      // Check if the file is available in the AWS S3 bucket
      const doesFileExist = await isFileAvailableInBucket(fileName); 

      if (doesFileExist) {
          const command = new GetObjectCommand({
              Bucket: process.env.AWS_BUCKET,
              Key: `${AWS_SUBDIR_PATH}/${fileName}`,
          });

          // Generate a signed URL without expiration time
          const url = await getSignedUrl(s3Client, command);
          return url;
      } else {
          // Return an error message if the file is not available in the bucket
          throw new Error(`image not found: ${fileName}`);
      }
  } catch (err: any) {
    throw new Error(err);
  }
}

// all this just to get the img url...
const addImgUrlToCocktails = async (cocktailDbResults: Array<Model<any, any>>) => {
  let cocktails;
  if (cocktailDbResults) {
    // cocktail is a Model obj representing a cocktail entry
    cocktails = await Promise.all(cocktailDbResults.map(async (cocktail: any) => {
      const copy = {...cocktail.dataValues};

      if (copy.img_file_name) {
        const thumbnailFilePath = `${copy.id}/small/${copy.img_file_name}`;
    
        try {
          // @ts-ignore
          copy.imgUrl = await getImageUrl(thumbnailFilePath);
        } catch (e) {
          // do nothing -- too noisy to log all the "img not found" msgs
        }
      }

      return copy;
    }));
  }

  return cocktails;
}

export {
  uploadImage,
  getImageUrl,
  addImgUrlToCocktails,
}