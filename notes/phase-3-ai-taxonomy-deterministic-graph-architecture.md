# Phase 3 Architecture: AI-Reasoned Taxonomy to Deterministic Optimizely Graph Queries

## Purpose

The goal of Phase 3 is to demonstrate how AI can interpret a natural-language campaign or experience request, reason over a controlled taxonomy, and convert that intent into a deterministic query against Optimizely Graph.

The core design principle is:

> **AI handles ambiguity. Taxonomy establishes meaning. Code enforces the contract. Graph performs deterministic retrieval.**

The AI should **not** be responsible for generating arbitrary GraphQL. Instead, the AI is used only for the fuzzy semantic task of mapping human language into a small, governed set of taxonomy values. Once those values are identified and validated, ordinary application code generates the Graph query deterministically.

This creates an architecture that is explainable, testable, repeatable, and safe enough to use as the foundation for automated experience assembly.

---

## Phase 3 Goal

A representative campaign brief might be:

> Create a personalized portal for Retail Buyers to find Minority-Owned, Award-Winning Hot Sauce Makers at the Winter Fancy Food Show.

The system should understand the meaning of that request even if the user does not use the exact CMS terminology.

For example, a user could instead write:

> Build something for grocery buyers attending Winter Fancy Food who are looking for diverse hot sauce brands that have won awards.

Both requests should resolve to the same normalized intent and therefore produce the same deterministic Graph query.

The desired behavior is:

1. Accept a natural-language experience request.
2. Identify the intended audience or persona.
3. Identify which structured content should qualify for retrieval.
4. Map natural-language concepts to approved taxonomy values.
5. Validate all inferred values against the controlled vocabulary.
6. Generate a deterministic query specification.
7. Convert that specification into a deterministic Optimizely Graph query.
8. Retrieve only content that matches the approved filters.
9. Use audience context to determine how the retrieved content should be assembled and presented.

---

# Recommended Minimal Taxonomy

For the initial Phase 3 demonstration, the taxonomy should be intentionally small.

The purpose is not to model the entire Specialty Food Association domain. The purpose is to provide enough semantic structure for AI to reason over while keeping the demo easy to understand and govern.

## 1. Product Category

Describes what the maker produces.

Example values:

- Hot Sauce
- Cheese
- Chocolate
- Snacks

Canonical keys:

```text
hot_sauce
cheese
chocolate
snacks
```

---

## 2. Maker Attribute

Describes a structured characteristic of the maker or business.

Example values:

- Minority-Owned
- Woman-Owned
- Veteran-Owned

Canonical keys:

```text
minority_owned
woman_owned
veteran_owned
```

---

## 3. Recognition

Describes recognition or award status.

For the minimum viable demonstration, this can initially be very simple.

Example:

- Award-Winning

Canonical key:

```text
award_winning
```

In a more mature implementation, this could later become a relationship to an Award content type rather than a simple taxonomy.

---

## 4. Event

Identifies the event with which the maker or content is associated.

Example values:

- Winter Fancy Food Show
- Summer Fancy Food Show

Canonical keys:

```text
winter_fancy_food
summer_fancy_food
```

In a production implementation, Event is likely better represented as a content relationship because events eventually contain additional metadata such as:

- date
- venue
- location
- booth information
- sessions
- exhibitors
- sponsors

For the initial demo, however, either a taxonomy or relationship can work.

---

## Persona / Audience Context

Persona should be treated differently from the retrieval taxonomy.

Example:

```text
retail_buyer
```

The phrase "Retail Buyer" describes **who the experience is for**, not necessarily a characteristic of the Maker records being retrieved.

Therefore:

- taxonomy filters determine **which content qualifies**
- persona context determines **how the qualifying content should be presented**

For example, a Retail Buyer experience might emphasize:

- wholesale availability
- product categories
- distribution information
- booth number
- maker contact information
- buyer-oriented calls to action
- product discovery cards

This distinction is important because it keeps content retrieval separate from presentation logic.

---

# High-Level Architecture

```text
Natural-language campaign brief
            |
            v
      AI intent reasoning
            |
            v
Normalized structured intent
            |
            v
  Schema + taxonomy validation
            |
            v
 Deterministic query builder
            |
            v
      Optimizely Graph
            |
            v
   Matching structured content
            |
            v
 AI-assisted experience assembly
            |
            v
   Personalized user experience
```

The most important architectural boundary is between:

```text
AI reasoning
```

and:

```text
query execution
```

The AI should never have unrestricted authority to construct arbitrary Graph queries.

---

# Detailed Processing Flow

## Step 1: Receive the Campaign Brief

Example input:

```text
Create a personalized portal for Retail Buyers to find
Minority-Owned, Award-Winning Hot Sauce Makers at the
Winter Fancy Food Show.
```

This input is intentionally natural language. The user should not need to understand the underlying taxonomy.

---

## Step 2: Provide the AI with the Controlled Vocabulary

The AI should not invent taxonomy values.

Instead, the application supplies the allowed values, identifiers, descriptions, and optionally aliases.

Example:

```json
{
  "productCategory": [
    {
      "id": "hot_sauce",
      "label": "Hot Sauce",
      "aliases": ["hot sauces", "hot sauce brands", "spicy sauce"]
    },
    {
      "id": "cheese",
      "label": "Cheese"
    },
    {
      "id": "chocolate",
      "label": "Chocolate"
    }
  ],
  "makerAttribute": [
    {
      "id": "minority_owned",
      "label": "Minority-Owned",
      "aliases": ["diverse-owned", "minority owned business"]
    },
    {
      "id": "woman_owned",
      "label": "Woman-Owned"
    },
    {
      "id": "veteran_owned",
      "label": "Veteran-Owned"
    }
  ],
  "recognition": [
    {
      "id": "award_winning",
      "label": "Award-Winning",
      "aliases": ["won awards", "award recipient", "recognized brand"]
    }
  ],
  "event": [
    {
      "id": "winter_fancy_food",
      "label": "Winter Fancy Food Show",
      "aliases": ["Winter Fancy Food", "Winter Fancy"]
    },
    {
      "id": "summer_fancy_food",
      "label": "Summer Fancy Food Show"
    }
  ],
  "persona": [
    {
      "id": "retail_buyer",
      "label": "Retail Buyer",
      "aliases": ["grocery buyer", "buyer", "retailer"]
    }
  ]
}
```

This vocabulary is the semantic contract between the CMS and the AI.

---

# Step 3: AI Performs Semantic Normalization

The AI maps natural language into a predefined structured schema.

For example, this request:

```text
Build something for grocery buyers attending Winter Fancy Food
who are looking for diverse hot sauce brands that have won awards.
```

should normalize to:

```json
{
  "entity": "maker",
  "filters": {
    "productCategory": ["hot_sauce"],
    "makerAttribute": ["minority_owned"],
    "recognition": ["award_winning"],
    "event": ["winter_fancy_food"]
  },
  "persona": "retail_buyer"
}
```

At this point, the AI has completed its primary reasoning task.

It has **not created GraphQL**.

---

# Step 4: Validate the AI Output

The application should validate the AI response before any query is executed.

Validation should occur at two levels.

## Structural Validation

The AI response must conform to a known schema.

Example conceptual schema:

```json
{
  "entity": "maker",
  "filters": {
    "productCategory": ["string"],
    "makerAttribute": ["string"],
    "recognition": ["string"],
    "event": ["string"]
  },
  "persona": "string"
}
```

An implementation could enforce this with:

- JSON Schema
- Pydantic
- Zod
- TypeScript interfaces plus runtime validation
- another strongly typed validation mechanism

---

## Vocabulary Validation

Every returned taxonomy ID must actually exist in the controlled vocabulary.

For example:

```text
hot_sauce
```

is valid.

But:

```text
super_spicy_products
```

would be rejected unless that value has been explicitly defined.

This prevents hallucinated taxonomy values from reaching Graph.

---

# Step 5: Produce a Deterministic Query Specification

Once validated, the normalized intent becomes a trusted query specification.

Example:

```json
{
  "entity": "maker",
  "filters": {
    "productCategory": ["hot_sauce"],
    "makerAttribute": ["minority_owned"],
    "recognition": ["award_winning"],
    "event": ["winter_fancy_food"]
  }
}
```

At this stage, no AI reasoning should be required.

The application now has structured inputs that can be converted mechanically into a Graph query.

---

# Step 6: Map Canonical IDs to Graph Values

The canonical IDs used by the AI do not need to be identical to the values expected by Optimizely Graph.

For example:

```text
hot_sauce
```

may map internally to:

```text
taxonomy-id-83742
```

or:

```text
Hot Sauce
```

depending on how the content model and Graph schema are configured.

A mapping layer should handle this.

Example:

```json
{
  "hot_sauce": "graph-taxonomy-id-hot-sauce",
  "minority_owned": "graph-taxonomy-id-minority-owned",
  "award_winning": "graph-taxonomy-id-award-winning",
  "winter_fancy_food": "graph-event-id-winter-fancy-food"
}
```

This decouples AI-facing semantics from CMS implementation details.

---

# Why Canonical IDs Matter

Using canonical IDs rather than labels makes the architecture much more resilient.

Suppose editors rename:

```text
Winter Fancy Food Show
```

to:

```text
Winter FancyFaire
```

The identifier can remain:

```text
winter_fancy_food
```

The AI contract stays stable even though the editorial label changes.

The same principle applies to all taxonomy values.

---

# Step 7: Deterministically Generate GraphQL

The application should use a predefined query template or query builder.

Conceptually:

```graphql
query FindMakers {
  Maker(
    where: {
      ProductCategory: {
        in: ["Hot Sauce"]
      }
      MakerAttribute: {
        in: ["Minority-Owned"]
      }
      Recognition: {
        in: ["Award-Winning"]
      }
      Event: {
        in: ["Winter Fancy Food Show"]
      }
    }
  ) {
    items {
      Name
      Description
      Logo
      Products
      BoothNumber
    }
  }
}
```

The exact Optimizely Graph syntax will depend on the implemented schema, but the architectural principle remains the same.

The AI does not write this query.

Application code does.

---

# Determinism

This is one of the most important properties of the design.

The following two requests:

```text
Create a personalized portal for Retail Buyers to find
Minority-Owned, Award-Winning Hot Sauce Makers at the
Winter Fancy Food Show.
```

and:

```text
Build something for grocery buyers attending Winter Fancy Food
who are looking for diverse hot sauce brands that have won awards.
```

may be phrased differently, but if the AI normalizes both to:

```json
{
  "entity": "maker",
  "filters": {
    "productCategory": ["hot_sauce"],
    "makerAttribute": ["minority_owned"],
    "recognition": ["award_winning"],
    "event": ["winter_fancy_food"]
  },
  "persona": "retail_buyer"
}
```

then both produce the exact same Graph query.

This is the central demonstration:

> **Natural language can vary while retrieval remains deterministic.**

---

# Suggested Content Model

A simple Maker content model could look like:

```text
Maker
|
+-- Name
+-- Description
+-- Logo
+-- Product Category
+-- Maker Attributes
+-- Awards
+-- Events
+-- Products
+-- Booth Number
+-- Contact Information
```

For the first prototype:

```text
Product Category   -> taxonomy
Maker Attributes   -> taxonomy
Recognition        -> taxonomy or simple structured field
Event              -> taxonomy or relationship
```

For a more mature implementation:

```text
Product Category   -> taxonomy
Maker Attributes   -> taxonomy
Awards              -> relationship to Award entities
Events              -> relationship to Event entities
```

---

# Separating Retrieval from Experience Assembly

Phase 3 really contains two distinct reasoning problems.

## Reasoning Problem 1: What Content Qualifies?

The system determines:

```text
Product Category = Hot Sauce
Maker Attribute  = Minority-Owned
Recognition      = Award-Winning
Event            = Winter Fancy Food Show
```

This drives deterministic retrieval.

---

## Reasoning Problem 2: How Should It Be Presented?

The system separately determines:

```text
Persona = Retail Buyer
```

This can influence the presentation layer.

For example, for a Retail Buyer the system could prioritize:

```text
Maker Name
Product Images
Product Category
Wholesale Availability
Distribution
Booth Number
Buyer Contact
Request Samples CTA
Meet at Show CTA
```

A consumer persona might instead receive:

```text
Brand Story
Product Images
Flavor Profiles
Where to Buy
Recipes
Social Links
```

The underlying maker results could be identical, while the assembled interface differs.

---

# Recommended Phase 3 Runtime Flow

```text
1. User enters campaign brief
          |
          v
2. AI interprets user intent
          |
          v
3. AI selects only allowed taxonomy IDs
          |
          v
4. Application validates schema
          |
          v
5. Application validates taxonomy IDs
          |
          v
6. Query builder maps taxonomy IDs to Graph values
          |
          v
7. Deterministic Optimizely Graph query executes
          |
          v
8. Matching makers are returned
          |
          v
9. Persona context guides component selection
          |
          v
10. Experience is assembled
```

---

# Recommended AI Output Contract

The AI should be required to return a limited object such as:

```json
{
  "entity": "maker",
  "filters": {
    "productCategory": [],
    "makerAttribute": [],
    "recognition": [],
    "event": []
  },
  "persona": null,
  "confidence": {
    "productCategory": 0.0,
    "makerAttribute": 0.0,
    "recognition": 0.0,
    "event": 0.0,
    "persona": 0.0
  }
}
```

The confidence values are optional but useful for debugging and demo transparency.

---

# Confidence and Ambiguity Handling

The system should not force a taxonomy match when one is not justified.

For example:

```text
Show me exciting new food brands.
```

may not provide enough information to infer:

```text
Product Category
Maker Attribute
Recognition
Event
```

A valid normalized response could therefore be:

```json
{
  "entity": "maker",
  "filters": {
    "productCategory": [],
    "makerAttribute": [],
    "recognition": [],
    "event": []
  },
  "persona": null
}
```

The application can then decide whether to:

- run a broad query
- request clarification
- apply a configured default
- stop the automated assembly process

For the Phase 3 demo, the input can be intentionally designed to contain enough semantic information to produce a confident match.

---

# Hallucination Protection

The architecture should assume that the AI can make mistakes.

Therefore, the AI output should never be considered authoritative until validated.

Recommended guardrails:

1. The AI can select only IDs supplied in the current taxonomy vocabulary.
2. Unknown taxonomy values are rejected.
3. The entity type must come from an approved list.
4. Query operators are controlled by application code.
5. The AI cannot supply arbitrary GraphQL.
6. The AI cannot specify arbitrary fields to retrieve.
7. Query templates are predefined.
8. Maximum result counts are enforced by the application.
9. Invalid structured outputs are retried or rejected.
10. All reasoning outputs and generated query specs can be logged for traceability.

---

# Why the AI Should Not Generate GraphQL Directly

Allowing the LLM to generate GraphQL directly creates unnecessary risk and variability.

Potential problems include:

- invalid syntax
- hallucinated fields
- hallucinated taxonomy values
- inconsistent query structure
- unexpectedly expensive queries
- schema coupling
- hard-to-test behavior
- prompt injection concerns
- difficulty explaining why two similar prompts produced different retrieval behavior

By contrast:

```text
Natural language
      ->
Controlled semantic IDs
      ->
Validated query specification
      ->
Deterministic Graph query
```

creates a much stronger architecture.

---

# Testing Strategy

Because the AI output is normalized before query execution, the system can be tested in layers.

## AI Interpretation Tests

Input:

```text
Find diverse hot sauce brands at Winter Fancy Food that have won awards.
```

Expected normalized output:

```json
{
  "productCategory": ["hot_sauce"],
  "makerAttribute": ["minority_owned"],
  "recognition": ["award_winning"],
  "event": ["winter_fancy_food"]
}
```

---

## Query Builder Tests

Input:

```json
{
  "productCategory": ["hot_sauce"],
  "makerAttribute": ["minority_owned"],
  "recognition": ["award_winning"],
  "event": ["winter_fancy_food"]
}
```

Expected result:

```text
A specific known Graph query or query variables object.
```

This test does not involve AI at all.

---

## Semantic Equivalence Tests

The following prompts should normalize to the same result:

```text
Minority-Owned Hot Sauce Makers
```

```text
Diverse-owned hot sauce brands
```

```text
Hot sauce businesses owned by underrepresented founders
```

If the controlled taxonomy and prompt instructions support that interpretation, all three should map to:

```text
minority_owned
hot_sauce
```

This allows the team to measure semantic consistency rather than merely checking whether the generated language sounds plausible.

---

# Observability

For a strong technical demonstration, consider displaying the intermediate reasoning artifacts.

For example:

```text
Campaign brief
     |
     v

AI normalized intent

Product Category: Hot Sauce
Maker Attribute: Minority-Owned
Recognition: Award-Winning
Event: Winter Fancy Food Show
Persona: Retail Buyer

     |
     v

Validated query specification

     |
     v

Optimizely Graph query

     |
     v

7 matching makers
```

This makes the demo easier to trust because the audience can see exactly how natural language becomes deterministic retrieval.

---

# Phase 3 Demo Narrative

A concise way to explain the architecture during the demo is:

> The campaign manager describes the desired experience in natural language. AI interprets the request, but it does not search the CMS arbitrarily and it does not generate uncontrolled GraphQL. Instead, it maps the request to a governed taxonomy. The application validates those taxonomy values and translates them into a deterministic Optimizely Graph query. The retrieved content is therefore predictable and explainable, while AI still gives the user the flexibility to express intent naturally.

A shorter version is:

> **AI reasons over a controlled semantic vocabulary, then deterministic code retrieves the content.**

---

# Example End-to-End Walkthrough

## User Input

```text
Create a personalized portal for Retail Buyers to find
Minority-Owned, Award-Winning Hot Sauce Makers at the
Winter Fancy Food Show.
```

---

## AI Interpretation

```json
{
  "entity": "maker",
  "filters": {
    "productCategory": ["hot_sauce"],
    "makerAttribute": ["minority_owned"],
    "recognition": ["award_winning"],
    "event": ["winter_fancy_food"]
  },
  "persona": "retail_buyer"
}
```

---

## Validation

```text
maker                  -> valid entity
hot_sauce              -> valid Product Category
minority_owned         -> valid Maker Attribute
award_winning          -> valid Recognition
winter_fancy_food      -> valid Event
retail_buyer           -> valid Persona
```

All values pass.

---

## Deterministic Query Specification

```json
{
  "entity": "maker",
  "where": {
    "productCategory": ["hot_sauce"],
    "makerAttribute": ["minority_owned"],
    "recognition": ["award_winning"],
    "event": ["winter_fancy_food"]
  }
}
```

---

## Graph Query

Conceptually:

```graphql
query FindMakers {
  Maker(
    where: {
      ProductCategory: { in: ["Hot Sauce"] }
      MakerAttribute: { in: ["Minority-Owned"] }
      Recognition: { in: ["Award-Winning"] }
      Event: { in: ["Winter Fancy Food Show"] }
    }
  ) {
    items {
      Name
      Description
      Logo
      Products
      BoothNumber
    }
  }
}
```

---

## Graph Results

```text
Maker A
Maker B
Maker C
Maker D
```

---

## Persona-Aware Assembly

Because the persona is:

```text
retail_buyer
```

the application or assembly agent selects components such as:

```text
Buyer-focused hero
Maker comparison cards
Product cards
Booth information
Wholesale / distribution metadata
Contact maker CTA
Schedule meeting CTA
```

---

# Architectural Principle

The final architecture can be summarized as:

```text
Human intent
    |
    v
AI semantic reasoning
    |
    v
Controlled taxonomy values
    |
    v
Schema validation
    |
    v
Deterministic query specification
    |
    v
Deterministic Optimizely Graph query
    |
    v
Structured content
    |
    v
Persona-aware experience assembly
```

The critical design choice is that **AI ends before query execution begins**.

This gives Phase 3 the flexibility of AI without sacrificing the predictability of structured content retrieval.

---

# Recommended Initial Scope

For the first Phase 3 prototype, keep the implementation deliberately constrained.

Use:

```text
Entity:
- Maker

Taxonomies:
- Product Category
- Maker Attribute
- Recognition
- Event

Context:
- Persona
```

Seed only enough taxonomy values and Maker records to demonstrate the concept convincingly.

For example:

```text
Product Category
- Hot Sauce
- Cheese
- Chocolate

Maker Attribute
- Minority-Owned
- Woman-Owned
- Veteran-Owned

Recognition
- Award-Winning

Event
- Winter Fancy Food Show
- Summer Fancy Food Show

Persona
- Retail Buyer
```

This is sufficient to demonstrate the architectural principle without spending unnecessary effort modeling the entire SFA content domain.

---

# Future Evolution

Once the basic pattern is proven, the same architecture can expand to additional dimensions such as:

```text
Product Category
Maker Attribute
Award Type
Event
Geography
Distribution Channel
Dietary Attribute
Business Capability
Market Availability
Price Position
Certification
```

The AI reasoning mechanism does not fundamentally change.

It simply receives a larger controlled vocabulary.

Similarly, the deterministic query builder can grow to support additional filters and relationships without giving the AI unrestricted access to GraphQL.

---

# Final Recommendation

For Phase 3, implement AI as a **semantic normalization layer**, not as the query engine.

The system should:

1. maintain a controlled taxonomy in the CMS
2. expose the approved vocabulary to the AI
3. ask AI to convert natural language into canonical taxonomy IDs
4. validate those IDs
5. translate them through deterministic application code
6. query Optimizely Graph
7. use persona context separately for experience assembly

The strongest way to describe the architecture is:

> **AI reasons over a controlled semantic vocabulary, while deterministic application logic converts that reasoning into trusted Optimizely Graph queries.**

This preserves the advantages of natural-language interaction while keeping content retrieval governed, reproducible, testable, and explainable.
