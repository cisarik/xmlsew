#!/bin/bash
chown -vR www-data static
chown -vR www-data assets
chown -vR www-data protected/runtime
chmod -vR 0744 assets
chmod -vR 0744 protected/runtime
