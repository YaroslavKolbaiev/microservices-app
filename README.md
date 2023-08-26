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

## LECTURE 231

Node Alpine Docker images are now likely using the v16 version of Node, so, we will again encounter a situation that will require a catch block.

Change this code in client/pages/index.js

const LandingPage = ({ currentUser }) => {
console.log(currentUser);
axios.get('/api/users/currentuser');

return <h1>Landing Page</h1>;
};
to this:

const LandingPage = ({ currentUser }) => {
console.log(currentUser);
axios.get('/api/users/currentuser').catch((err) => {
console.log(err.message);
});

return <h1>Landing Page</h1>;
};

## LECTURE 256 (NPM COMMAND)

npm publish --access public

npm update <pakage_name>

## NATS
