#! /bin/bash

# generate random mock data and start mockserver
# blade mock node_modules/@adcubum/syrius-domain-subdomain-bff-spec/build/swagger/__bundled/BundledService.swagger.json -s 8090

#  start mockserver without generate mock data
blade mock node_modules/@adcubum/syrius-domain-subdomain-bff-spec/build/swagger/__bundled/BundledService.swagger.json -k -s 8090
