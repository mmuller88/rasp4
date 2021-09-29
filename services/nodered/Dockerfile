FROM nodered/node-red:2.0.6
RUN for addonnodes in \
  node-red-node-pi-gpiod \
  node-red-dashboard \
  node-red-contrib-influxdb \
  node-red-contrib-boolean-logic \
  node-red-node-rbe \
  node-red-configurable-ping \
  node-red-node-email \
  node-red-contrib-cron-plus \
  node-red-contrib-persist \
  node-red-contrib-power-monitor \
  node-red-contrib-telegrambot \
  node-red-contrib-time-range-switch \
  node-red-contrib-zigbee2mqtt \
  node-red-node-openweathermap \
  nodered-contrib-signal-client \
  ; do \
  npm install ${addonnodes} ;\
  done;
