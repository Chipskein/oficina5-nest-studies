#!/bin/bash
BASE_URL="http://localhost:3000"
echo "Criando user"
id=$(curl -X POST "$BASE_URL"/users \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "johndoe@example.com",
       "password": "securepassword"
     }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

echo "ID recebido: $id"
USER_ID=$id

echo "Logando com user"
BEARER_TOKEN=$(curl -X POST "$BASE_URL/auth" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "johndoe@example.com",
       "password": "securepassword"
     }' | grep -o '"token":"[^"]*' | cut -d':' -f2 | tr -d '"')
echo "Token recebido: $BEARER_TOKEN"

echo "Get all Users"
curl -X GET "$BASE_URL/users" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i

echo "Update User"
curl -X PATCH "$BASE_URL/users/$USER_ID" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -d '{
       "firstName": "Johnny"
     }' \
     -w "\nResponse: %{http_code}\n" -i


echo "Get User"
curl -X GET "$BASE_URL/users/$USER_ID" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i


echo "Uploading file"
filepath='/home/chipskein/Pictures/black-frost.jpg'
fileId=$(curl -s -X POST "$BASE_URL/files" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -F "file=@$filepath" | grep -o '"id":[0-9]*' | cut -d':' -f2 | tr -d '"' | xargs |cut -d' ' -f1)
echo "File ID: $fileId"


echo "Files from user"
curl -X GET "$BASE_URL/files" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i


echo "Get File by id from user"
curl -X GET "$BASE_URL/files/$fileId" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i

echo "Delete file"
curl -X DELETE "$BASE_URL/files/$fileId" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i


echo "Delete User"
curl -X DELETE "$BASE_URL/users/$USER_ID" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i
