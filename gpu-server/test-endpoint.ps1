param(
  [Parameter(Mandatory=$true)][string]$BaseUrl,
  [Parameter(Mandatory=$true)][string]$ApiKey,
  [string]$Model='google/medgemma-1.5-4b-it'
)
$endpoint = $BaseUrl.TrimEnd('/')
if ($endpoint.EndsWith('/v1')) { $endpoint += '/chat/completions' }
elseif (-not $endpoint.EndsWith('/chat/completions')) { $endpoint += '/v1/chat/completions' }
$body = @{ model=$Model; messages=@(@{role='user';content='In one sentence, what does ECG stand for?' }); max_tokens=80; temperature=0.2 } | ConvertTo-Json -Depth 8
Invoke-RestMethod -Uri $endpoint -Method POST -ContentType 'application/json' -Headers @{Authorization="Bearer $ApiKey"} -Body $body | ConvertTo-Json -Depth 8
