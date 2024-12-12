
# EYECON API Documentation

## Base URL
```
"ip":8080
```


# Endpoints

### 1. Get Model
- **URL**: `/`
- **Method**: `GET`  
- **Response**:
  ```json
  Berhasil memuat model
  ```

---

### 2. Predict a Photo
- **URL**: `/predict`
- **Method**: `POST`  
- **Headers**:  
  ```
  Content-Type: multipart/form-data
  ```
- **Body**:
  ```json
  {
    "image": "{image}.jpeg/.jpg/.png" as file,
    "id_user": "{id_user}"
  }
  ```
- **Response**:
  ```json
  {
      "status": "success",
      "message": "Prediction Success",
      "data": {
          "id_user": "{id_user}",
          "id": "{id}",
          "img_url": "{url of image}",
          "result": "{result}",
          "diagnosa": "{diagnosa}",
          "createdAt": "{date and time}"
      }
  }
  ```

---

### 3. Retrieve Diagnose History
- **URL**: `/predict/histories/{id_user}`
- **Method**: `GET`  
- **Response**:
  ```json
  {
    "status":"success",
    "data":[{
      "id_user": "{id_user}",
          "id": "{id}",
          "img_url": "{url of image}",
          "result": "{result}",
          "diagnosa": "{diagnosa}",
          "createdAt": "{date and time}"
      },
      {
      "id_user": "{id_user}",
          "id": "{id}",
          "img_url": "{url of image}",
          "result": "{result}",
          "diagnosa": "{diagnosa}",
          "createdAt": "{date and time}"
      },..]
  }
  ```

---

### 4. Retrieve Diagnose History Item
- **URL**: `/predict/{id}`
- **Method**: `GET`  
- **Response**:
  ```json
  {
    "status":"success",
    "data":{
      "id_user": "{id_user}",
          "id": "{id}",
          "img_url": "{url of image}",
          "result": "{result}",
          "diagnosa": "{diagnosa}",
          "createdAt": "{date and time}"
      }
  }
  ```

---

### 5. Delete a History Item
- **URL**: `/predict/{id}`
- **Method**: `DELETE`  
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Data berhasil di hapus"
  }
  ```

---
