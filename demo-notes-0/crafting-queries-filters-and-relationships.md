> ## Documentation Index
> Fetch the complete documentation index at: https://docs.developers.optimizely.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Craft queries, filters, and relationships

How to use GraphQL in Optimizely Graph to filter content by dates, names, and text matches while optimizing query performance.

Use Optimizely Graph to query your content efficiently using GraphQL. Each content type in your CMS becomes a GraphQL type, and you can configure fields to optimize performance.

## Understand query structure

Optimizely Graph automatically creates a GraphQL type for each CMS content type. You can configure fields as:

* **Filterable** – Use in `where` clauses to narrow results.
* **Searchable** – Use for text search operations like match or contains.
* **Output only** – Use for read-only fields that do not need filtering (best for performance).

For example, use the following query to retrieve up to 10 articles whose names include "Alloy" and were published after January 1, 2010. It sorts the results by publish date, showing the most recent first.

```graphql
query BasicQuery($name: String = "Alloy", $startPublishBefore: Date = "2010-01-01T00:00:00Z") {
  ArticlePage(
    where: { Name: { contains: $name }, StartPublish: { gte: $startPublishBefore } }
    orderBy: { StartPublish: DESC }
    limit: 10
  ) {
    items {
      Name
      RelativePath
      TeaserText
      StartPublish
    }
    total
  }
}
```

Test your queries in the <Anchor label="GraphQL Explorer" target="_blank" href="https://cg.optimizely.com/content/v2?auth=3JCcia5gTU2RTiOv2aUCXu1ktYJjqzGgjXh2AVMFvxPyhJOY&stored=true">GraphQL Explorer</Anchor>.

## Use filter operators

* **Equality filters** – Use this filter to find articles where the `Name` contains "Alloy" and the `SiteId` matches exactly.

```graphql
query EqualityFilters($name: String = "Alloy", $siteId: String = "1a4a208d-0089-4655-9874-a2cb2c9e213d") {
  ArticlePage(
    where: {
      Name: { contains: $name }                 # Partial match works better
      SiteId: { eq: $siteId }                # Exact match for status
    }
  ) {
    items {
      Name
      RelativePath
      TeaserText
      SiteId
    }
  }
}
```

* **Comparison filters** – Use this filter to retrieve articles published between two dates.

```graphql
query ComparisonFilters($minDate: Date = "2010-01-01T00:00:00Z", $maxDate: Date = "2020-12-31T23:59:59Z") {
  ArticlePage(where: { StartPublish: { gte: $minDate, lte: $maxDate } }) {
    items {
      Name
      StartPublish
      RelativePath
    }
  }
}
```

* **String filters** – Use this filter to find articles where the `Name` contains "Alloy" and the full text matches "technology".

```graphql
query StringFilters {
  ArticlePage(
    where: {
      Name: { contains: "Alloy" }              # Contains substring
      _fulltext: { match: "technology" }      # Full-text search
    }
  ) {
    items {
      Name
      RelativePath
    }
  }
}
```

* **Array and collection filters** – Limits results to the specified number of articles where the `Name` contains "Alloy".

```graphql
query ArrayFilters {
  ArticlePage(
    where: {
      Name: { contains: "Alloy" }                    # Simple filter that works
    }
    limit: 5
  ) {
    items {
      Name
      RelativePath
    }
  }
}
```

## Complex filtering with logical operators

* **AND operations (default)** – Use this filter to return articles where both conditions are true. The `Name` contains "Alloy" and `StartPublish` is after January 1, 2024.

```graphql
query AndFilters {
  ArticlePage(
    where: {
      # All conditions must be true (implicit AND)
      Name: { contains: "Alloy" }
      StartPublish: { gte: "2024-01-01T00:00:00Z" }
    }
  ) {
    items {
      Name
      StartPublish
      RelativePath
    }
  }
}
```

* **OR operations** – Use this filter to return articles where the `Name` contains either "Alloy" or "Guide".

```graphql
query OrFilters {
  ArticlePage(
    where: {
      _or: [
        { Name: { contains: "Alloy" } }
        { Name: { contains: "Guide" } }
      ]
    }
  ) {
    items {
      Name
      RelativePath
    }
  }
}
```

* **Nested logical operations** – Combines OR and AND logic to find articles that match either name and are published after January 1, 2024.

```graphql
query ComplexFilters {
  ArticlePage(
    where: {
      _and: [
        {
          _or: [
            { Name: { contains: "Alloy" } }
            { Name: { contains: "Guide" } }
          ]
        }
        {
          StartPublish: { gte: "2024-01-01T00:00:00Z" }
        }
      ]
    }
  ) {
    items {
      Name
      StartPublish
      RelativePath
    }
  }
}
```

## Performance optimization

* **Use `item` for single results** – Fetches a single article using item for better cache performance. Avoid using `items` with `limit: 1` as it reduces cache efficiency.

```graphql
# Excellent cache performance
query GetSingleArticle($path: String!) {
  ArticlePage(
    where: { RelativePath: { eq: $path } }
  ) {
    item {
      Name
      RelativePath
      MainBody
      StartPublish
    }
  }
}

# Poor cache performance
query GetSingleArticleBad($path: String!) {
  ArticlePage(
    where: { RelativePath: { eq: $path } }
    limit: 1
  ) {
    items {  # Do not use items for single results
      Name
      RelativePath
      MainBody
    }
  }
}
```

* **Enable cached templates** – Configure Apollo Client to use stored queries for better performance.

```typescript
// Apollo Client configuration
const httpLink = createHttpLink({
  uri: 'your-endpoint',
  headers: {
    'cg-stored-query': 'template'  // Enable cached templates
  }
});
```

<br />