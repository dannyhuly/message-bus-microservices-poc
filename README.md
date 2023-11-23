# Message Bus POC

The following demo is a Typescript implantation of Message Bus.

### flowchart
[![](https://mermaid.ink/img/pako:eNqNkE1rwzAMhv-K0WmFlN3D2GErrJdCRwOF2TkIW2lN_BH8sVKa_vd5c2CHXaaL3lc8L0K6gfSKoIXB-Is8Y0is2wjHSr0aTS498Nr7FVuvn9m87br9zN4w0QWvFVwMX3rPngo5jziMyKbgVZb0KL2L2dLMdhQjnuglxxr-9ZwvmhXD3jNl6vsKbckYf_TBqAOFTy2J_5n8fys0YClY1KqcffteICCdyZKAtkiFYRQg3L1wmJM_XJ2ENoVMDeRJlRs3Gk8BLbQDmlimpHTyYVf_-PPOBiZ0H97bGrx_AZMSfGw?type=png)](https://mermaid.live/edit#pako:eNqNkE1rwzAMhv-K0WmFlN3D2GErrJdCRwOF2TkIW2lN_BH8sVKa_vd5c2CHXaaL3lc8L0K6gfSKoIXB-Is8Y0is2wjHSr0aTS498Nr7FVuvn9m87br9zN4w0QWvFVwMX3rPngo5jziMyKbgVZb0KL2L2dLMdhQjnuglxxr-9ZwvmhXD3jNl6vsKbckYf_TBqAOFTy2J_5n8fys0YClY1KqcffteICCdyZKAtkiFYRQg3L1wmJM_XJ2ENoVMDeRJlRs3Gk8BLbQDmlimpHTyYVf_-PPOBiZ0H97bGrx_AZMSfGw)

### sequence diagram
[![](https://mermaid.ink/img/pako:eNqVklFLwzAQx79KzJNiq-95GKgt20PHxBUGUpAjOWcxTWrSKKX0u3tdNh0MZOYhhLvc7__n7gYurUIuuMePgEZiVsPWQVMZRgdkZx170DWaLkbiHSPpbHY9hw6_oBdsnpfsNmb3MUov0XvY4n3wgrXOqiDxkpi1NYIt8qJYvWxWT0WWsBZ6bUEJloEx_VXk_FZPSgvU2m6s02qN7rOWKJi0xofmPOTe-QklJXZ6ps8bh63uj9A7WhS4YEN2V-bjQejIPCn8tOkPy_-hH1o8mY_DoO9l-cgc-pYkkCe8QddArWi2w1RU8e4NG6y4oKcC917xyoz0D0Jn172RXHQuYMJDq4i-3wMuXkF7iqKqaReWcVl2O5PwFsyztU0sHL8B3AvDGQ?type=png)](https://mermaid.live/edit#pako:eNqVklFLwzAQx79KzJNiq-95GKgt20PHxBUGUpAjOWcxTWrSKKX0u3tdNh0MZOYhhLvc7__n7gYurUIuuMePgEZiVsPWQVMZRgdkZx170DWaLkbiHSPpbHY9hw6_oBdsnpfsNmb3MUov0XvY4n3wgrXOqiDxkpi1NYIt8qJYvWxWT0WWsBZ6bUEJloEx_VXk_FZPSgvU2m6s02qN7rOWKJi0xofmPOTe-QklJXZ6ps8bh63uj9A7WhS4YEN2V-bjQejIPCn8tOkPy_-hH1o8mY_DoO9l-cgc-pYkkCe8QddArWi2w1RU8e4NG6y4oKcC917xyoz0D0Jn172RXHQuYMJDq4i-3wMuXkF7iqKqaReWcVl2O5PwFsyztU0sHL8B3AvDGQ)

### Prerequisite

1. NodeJS (`nvm` recommended)
2. Docker (+docker compose) for running local Kafka
3. Kafka (for kafka cli commands)

### Setup

Install 
```bash
npm i
# or
npm ci
```

Start Kafka Server
```bash
docker compose -f docker-compose.yml up -d
```

Create topic
```bash
kafka-topics --bootstrap-server localhost:9093 --create --topic message-bus-microservices-poc-topic --partitions 8 --replication-factor 1
kafka-topics --bootstrap-server localhost:9093 --list
```

### Run Project

Run `helloWorldServer`
```bash
npm run start:helloWorldServer
```

Run http `gateway`
```bash
npm run start:gateway
```


### Kafka Topic Debug Commands

```bash
kafka-console-consumer \
    --bootstrap-server localhost:9093 \
    --property print.key=true \
    --property key.separator="-" \
    --topic message-bus-microservices-poc-topic \
    --group poc-group-app-cli-monit
```
