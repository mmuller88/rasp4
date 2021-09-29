FROM nodered/node-red:2.0.6
RUN for addonnodes in \
  node-red-node-pi-gpiod \
  node-red-dashboard \
  node-red-contrib-influxdb \
  node-red-contrib-boolean-logic \
  node-red-node-rbe \
  node-red-configurable-ping \
  node-red-node-email \
  ; do \
  npm install ${addonnodes} ;\
  done;
