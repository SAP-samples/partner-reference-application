echo "SAP Forms Service by Adobe Integration Test -- START"
echo "Fetch the OAuth token"
response=$(curl "$main_service_broker_auth_server/oauth/token?grant_type=client_credentials&response_type=token" -u "$main_service_broker_client_id:$main_service_broker_client_secret")
echo $response

echo "Extract the access token from the response"
access_token=$(echo $response | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

echo "Get PDF content"
curl "$main_service_broker_endpoint/odata/v4/poetryslamservice/PDFDocument(ID=79ceab87-300d-4b66-8cc3-f82c679b77a1)/content" -H "Authorization: Bearer $access_token" --output pdfcontent.bin

echo "Get the first line of the PDF content"
first_line=$(head -n 1 pdfcontent.bin)
echo "First line of PDF: $first_line"

# Check if the PDF content is null
if [ -z "$first_line" ]; then
  echo "Content expected to be not null"
  exit 1
fi

# Check if the PDF content starts with '%PDF-'
if ! echo "$first_line" | grep -q '^%PDF-'; then
  echo "Content should start with: %PDF-"
  exit 1
fi

echo "PDF content is valid"
echo "SAP Forms Service by Adobe Integration Test -- END"
