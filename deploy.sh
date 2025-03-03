#!/bin/bash

scp html/* root@50.116.22.105:/var/www/html/
scp jsapp/* root@50.116.22.105:/var/www/jsapp/
ssh root@50.116.22.105 systemctl restart jsapp