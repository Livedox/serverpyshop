# The server part of the test task from pyshop


## Update schema.prisma on dev mode

````
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
````

## Env
````
JWT_SECRET = "afdghnyru354ywgeas"
AT_JWT_SECRET = "adsfvghnm65w45erdfvgbhnrwy4teradsfvgbhn"
RT_JWT_SECRET = "aasdvfgb345t6hb*(@$fdc)asdcasdcasdc"
CLIENT_URL = ""
````