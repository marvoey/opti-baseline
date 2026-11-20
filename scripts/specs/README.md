# cms:bulk specs

One JSON file per set of shared blocks for this site, run with:

```bash
npm run cms:bulk -- --spec scripts/specs/<file>.json --dry   # plan only, no writes
npm run cms:bulk -- --spec scripts/specs/<file>.json         # create / update / publish
```

Re-running a spec is safe: every item has an explicit or deterministic key, and items
already in the desired state cause no writes.

To turn an existing CMS folder into a spec (for example to read the content keys, or to
replay the blocks into another environment):

```bash
npm run cms:bulk -- --export <folderKey> --out scripts/specs/<file>.json
```

## Format

Property values are plain values; the script wraps them as `{"value": ...}` for the API.

```json
{
  "folder": { "name": "Product Cards", "parent": "env:ASSET_BASE_FOLDER_ID" },
  "contentType": "AcmeProductCard",
  "locale": "en",
  "publish": true,
  "items": [
    {
      "displayName": "Widget Pro",
      "properties": {
        "Title": "Widget Pro",
        "ImageUrl": "https://example.com/widget-pro.jpg",
        "Destination": { "url": "https://example.com/widget-pro", "text": "Widget Pro" }
      }
    }
  ]
}
```

- `folder.parent` is a content key or `env:VAR`; the folder is created when missing.
- `contentType` can also be set per item. It must be a `_component` type that exists in the CMS.
- Optional per item: `key` (32 hex characters) to pin the content key, `slug` to control the
  generated key.
