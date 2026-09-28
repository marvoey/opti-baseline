// Shared ABM taxonomy fields for the NIQ demo blocks (HeroBlock, ProofBlock,
// ActionBlock). Spread into a content type's `properties`, same pattern as
// blockWidth.ts. Kept `.ts` (not `.tsx`) so the `./cms/**/*.tsx` push glob
// does not scan it — only files that define content types should be picked up.

/** Spread into `properties` to add the shared Industry choice field. */
export function industryProperty(sortOrder = 20) {
  return {
    Industry: {
      type: 'string' as const,
      format: 'selectOne',
      displayName: 'Industry',
      description: 'Prospect industry vertical this content targets.',
      // Required for GraphQL `where` filtering (see /demo/governance-drift) —
      // without this, the field is invisible to the where-input schema.
      indexingType: 'queryable' as const,
      sortOrder,
      enum: [
        { value: 'CPG_FMCG', displayName: 'CPG / FMCG' },
        { value: 'Beverage_Alcohol', displayName: 'Beverage & Alcohol' },
        { value: 'Tech_Durables', displayName: 'Tech & Durables' },
        { value: 'PersonalCare', displayName: 'Personal Care' },
        { value: 'PackagedFoods', displayName: 'Packaged Foods' },
        { value: 'BeverageAlcohol', displayName: 'Beverage Alcohol' },
      ],
    },
  };
}

/** Spread into `properties` to add the shared Persona choice field. */
export function personaProperty(sortOrder = 21) {
  return {
    Persona: {
      type: 'string' as const,
      format: 'selectOne',
      displayName: 'Persona',
      description: 'Buyer persona this content targets.',
      indexingType: 'queryable' as const,
      sortOrder,
      enum: [
        { value: 'Ecommerce_Lead', displayName: 'Ecommerce Lead' },
        { value: 'Insights_Director', displayName: 'Insights Director' },
        { value: 'Category_Manager', displayName: 'Category Manager' },
        { value: 'Ecommerce_VP', displayName: 'Ecommerce VP' },
        { value: 'Category_Commercial', displayName: 'Category & Commercial' },
      ],
    },
  };
}

/** Spread into `properties` to add the shared Solution choice field. */
export function solutionProperty(sortOrder = 22) {
  return {
    Solution: {
      type: 'string' as const,
      format: 'selectOne',
      displayName: 'Solution',
      description: 'NIQ solution area this content promotes.',
      indexingType: 'queryable' as const,
      sortOrder,
      enum: [
        { value: 'DigitalShelf', displayName: 'Digital Shelf' },
        { value: 'ConsumerPanel', displayName: 'Consumer Panel' },
        { value: 'BASES', displayName: 'BASES' },
      ],
    },
  };
}

/** Spread into `properties` to add the shared account Tier choice field. */
export function tierProperty(sortOrder = 20) {
  return {
    Tier: {
      type: 'string' as const,
      format: 'selectOne',
      displayName: 'Tier',
      description: 'Account tier this action is scoped to.',
      indexingType: 'queryable' as const,
      sortOrder,
      enum: [
        { value: 'StrategicCustomer', displayName: 'Strategic Customer' },
        { value: 'MidMarket', displayName: 'Mid-Market' },
        { value: 'Prospect', displayName: 'Prospect' },
        { value: 'ConsiderationProspect', displayName: 'Consideration Prospect' },
      ],
    },
  };
}
