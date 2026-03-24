# env-doctor

[![CI](https://github.com/emoubarak/env-doctor/actions/workflows/ci.yml/badge.svg)](https://github.com/emoubarak/env-doctor/actions/workflows/ci.yml)

A CLI tool to validate environment variables via a `.env.schema` file.

## Overview

`env-doctor` helps you ensure your environment variables are correctly set according to a schema definition. It validates types, formats, and constraints for your environment variables.

## Installation

```bash
npm install -g @emoubarak/env-doctor
```

## Usage

### Initialize a schema

Scan your existing `.env` file and generate a `.env.schema.yaml`:

```bash
env-doctor init
```

Or specify custom paths:

```bash
env-doctor init -f ./config/my.env -o ./config/my.env.schema.yaml
```

### Check environment variables

Validate your `.env` file against the schema:

```bash
env-doctor check
```

Or specify custom paths:

```bash
env-doctor check -f ./config/my.env -s ./config/my.env.schema.yaml
```

## Schema Format

The schema file (`.env.schema.yaml`) defines validation rules for your environment variables:

```yaml
SESSION_ID:
  required: true
  format: uuid
DATABASE_URL:
  required: true
  format: url
PORT:
  required: false
  default: "3000"
  format: number
  min: 1
  max: 65535
API_KEY:
  required: true
  format: string
  min_length: 32
API_VERSION:
  required: false
  format: semver
  default: "1.0.0"
DEBUG:
  required: false
  format: boolean
CONFIG_JSON:
  required: false
  format: json
SECRET_KEY:
  required: true
  format: regex
  pattern: "^[a-zA-Z0-9]{32}$"
SERVER_HOST:
  required: true
  format: host
ADMIN_COLOR:
  required: true
  format: hex
ENCODED_DATA:
  required: true
  format: base64
CREATION_DATE:
  required: true
  format: date
TIMESTAMP:
  required: true
  format: datetime
```

### Supported Formats

- `string` (default)
- `number`
- `url`
- `email`
- `boolean`
- `json`
- `uuid` - Validates UUID v1, v4, and v5 formats
- `regex` - Validates against a custom regular expression pattern (requires `pattern` property)
- `date` - Validates ISO 8601 date format (YYYY-MM-DD)
- `datetime` - Validates ISO 8601 datetime format (YYYY-MM-DDTHH:mm:ss.sssZ)
- `port` - Validates network port numbers (1-65535)
- `host` - Validates hostnames or IP addresses
- `semver` - Validates semantic versioning format (X.Y.Z)
- `hex` - Validates hexadecimal color codes (#RGB or #RRGGBB)
- `base64` - Validates Base64 encoded strings

### Validation Options

- `required`: Whether the variable is required (default: false)
- `default`: Default value if the variable is not present
- `format`: Format to validate against
- `min` / `max`: For numbers, minimum and maximum values
- `min_length` / `max_length`: For strings, minimum and maximum lengths
- `pattern`: For regex format, specifies the regular expression pattern

## License

MIT