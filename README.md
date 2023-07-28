# Lecture 116 reg Nginx Setup

## Ingress-srv file:

- to access anything inside of our cluster we use ingress-srv with Ngnx
- second option is to use POD. separate srv.yaml file for each service

## To access hosts file:

- open command line and type <code c:\windows\system32\drivers\etc\hosts>

## Kuberneties command to create secret "key-value" pair and use it in containers

- kubectl create secret generic jwt-secret --from-literal=[key-value]=[secret-value]
