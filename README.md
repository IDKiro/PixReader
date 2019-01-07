# PixReader

[简体中文](./docs/README-zh.md)

> This app is under development, you can try the old [demo[CN]](http://book.idkiro.xyz/) first, and there is the [notebook[CN]](/docs/notebook/README.md).

> If you want to use this demo, you can use the settings as follow:

```
Address: 176.122.140.215
port: 9000  
Access Key: minio
Secret Key: miniokey
Bucket Name: upload
Use SSL: false
```

## Screenshot

![](./docs/imgs/demo.gif)

## Usage

The current version only supports [minio](https://github.com/minio/minio)。

Enter the following command to build your private minio OSS on your server.

Use docker:

```
docker run -p 9000:9000 --name minio1 \
  -e "MINIO_ACCESS_KEY=username" \
  -e "MINIO_SECRET_KEY=password" \
  -v /mnt/data:/data \
  -v /mnt/config:/root/.minio \
  minio/minio server /data
```

Or binary:

```
wget https://dl.minio.io/server/minio/release/linux-amd64/minio
chmod +x minio
export MINIO_ACCESS_KEY=username
export MINIO_SECRET_KEY=password
(./minio server ./data &)
```

Open `address: port` to access minio. 

Now you need to create a bucket and modify the permissions manually.