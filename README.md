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
  rules:
    - host: ticketing.dev
      http:
        paths:
          - path: /api/users/?(.*)
            pathType: Prefix
            backend:
              service:
                name: auth-srv
                port:
                  number: 3000
We will include a separate v1 Ingress manifest attached to each appropriate lecture throughout the course so that students can refer to the changes.