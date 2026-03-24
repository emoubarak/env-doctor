# env-doctor

A CLI tool to validate environment variables via a `.env.schema` file.

## Overview

`env-doctor` helps you ensure your environment variables are correctly set according to a schema definition. It validates types, formats, and constraints for your environment variables.

## Installation

```bash
npm install -g env-doctor
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
DEBUG:
  required: false
  format: boolean
CONFIG_JSON:
  required: false
  format: json
```

### Supported Formats

- `string` (default)
- `number`
- `url`
- `email`
- `boolean`
- `json`

### Validation Options

- `required`: Whether the variable is required (default: false)
- `default`: Default value if the variable is not present
- `format`: Format to validate against
- `min` / `max`: For numbers, minimum and maximum values
- `min_length` / `max_length`: For strings, minimum and maximum lengths

## License

MIT