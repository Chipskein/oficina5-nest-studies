#!/bin/bash
BASE_URL="http://localhost:3000/users"
echo "Criando user"
id=$(curl -X POST "$BASE_URL" \
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
BEARER_TOKEN=$(curl -X POST "http://localhost:3000/auth" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "johndoe@example.com",
       "password": "securepassword"
     }' | grep -o '"token":"[^"]*' | cut -d':' -f2 | tr -d '"')
echo "Token recebido: $BEARER_TOKEN"

echo "Get all Users"
curl -X GET "$BASE_URL" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i

echo "Update User"
curl -X PATCH "$BASE_URL/$USER_ID" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -d '{
       "firstName": "Johnny"
     }' \
     -w "\nResponse: %{http_code}\n" -i

echo "Get User"
curl -X GET "$BASE_URL/$USER_ID" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i

echo "Delete User"
curl -X DELETE "$BASE_URL/$USER_ID" \
     -H "Authorization: Bearer $BEARER_TOKEN" \
     -w "\nResponse: %{http_code}\n" -i
