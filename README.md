# Lecture 116 reg Nginx Setup

## Ingress-srv file:

- to access anything inside of our cluster we use ingress-srv with Ngnx
- second option is to use POD. separate srv.yaml file for each service

## To access hosts file:

- open command line and type <code c:\windows\system32\drivers\etc\hosts>

Notably, a pathType needs to be added, and how we specify the backend service name and port has changed:

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
name: ingress-service
annotations:
kubernetes.io/ingress.class: nginx
nginx.ingress.kubernetes.io/use-regex: "true"
spec:
rules: - host: ticketing.dev
http:
paths: - path: /api/users/?(.\*)
pathType: Prefix
backend:
service:
name: auth-srv
port:
number: 3000
We will include a separate v1 Ingress manifest attached to each appropriate lecture throughout the course so that students can refer to the changes.

The express-validator library recently released a breaking v7 version where the ValidationError type is now a discriminated union:

https://express-validator.github.io/docs/migration-v6-to-v7#telling-error-types-apart

As well as renaming param to path

https://express-validator.github.io/docs/migration-v6-to-v7#renamed-properties

So, we'll need to update our conditional to add a check for an error of type field and use the new path property:

if (err instanceof RequestValidationError) {
const formattedErrors = err.errors.map((error) => {
if (error.type === 'field') {
return { message: error.msg, field: error.path };
}
});
return res.status(400).send({ errors: formattedErrors });
}
