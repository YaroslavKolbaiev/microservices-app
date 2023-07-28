## Updating the Image

(teminal must be run in folder of image being changed)

- Step1 - The deployment must be using the 'latest' tag in the pod section
- Step2 - Make an update to your code
- Step3 - Build the IMAGE by runninig "docker build -t [image_name] ."
- Step4 - Push the image to docker hub by running "docker push [image_name]"
- Step5 - run the command "kubectl rollout restart deployment [depl_name]"

# Lecture 116 reg Nginx Setup

## Ingress-srv file:

- to access anything inside of our cluster we use ingress-srv with Ngnx
- second option is to use POD. separate srv.yaml file for each service

## To access hosts file:

- open command line and type <code c:\windows\system32\drivers\etc\hosts>

## Kuberneties command to create secret "key-value" pair and use it in containers

- kubectl create secret generic jwt-secret --from-literal=[key-value]=[secret-value]

##

In the upcoming lecture, we will be adding the --only=prod flag to the npm install instruction of our Dockerfile. This flag no longer exists, and we need to use the --omit=dev flag instead.

FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]

##

In the upcoming lecture, we will be setting up our test environment with MongoMemoryServer. If you are using the latest versions of this library a few changes will be required:

In auth/src/test/setup.ts, change these lines:

mongo = new MongoMemoryServer();
const mongoUri = await mongo.getUri();
to this:

const mongo = await MongoMemoryServer.create();
const mongoUri = mongo.getUri();

Remove the useNewUrlParser and useUnifiedTopology parameters from the connect method. Change this:

await mongoose.connect(mongoUri, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
to this:

await mongoose.connect(mongoUri, {});

Then, find the afterAll hook and add a conditional check:

afterAll(async () => {
if (mongo) {
await mongo.stop();
}
await mongoose.connection.close();
});

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

## LECTURE 211

In the upcoming lecture (and later with the ticketing, orders and payments services) you may end up seeing a TS error like this in your test/setup.ts file:

Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.ts(7017)

To fix, find the following lines of code in src/test/setup.ts:

declare global {
namespace NodeJS {
export interface Global {
signin(): Promise<string[]>;
}
}
}
change to:

    declare global {
      var signin: () => Promise<string[]>;
    }

## LECTURE 220

So, the next.config.js file should now look like this:

module.exports = {
webpack: (config) => {
config.watchOptions.poll = 300;
return config;
},
};
