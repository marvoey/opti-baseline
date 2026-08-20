export type ContainerEntry = {
  copyType: string;
  contentType: string;
  envVar: string;
  key: string;
};

export const CONTAINER_CONFIG: ContainerEntry[] = [
  {
    copyType: 'Core Principle',
    contentType: 'PrgvCorePrinciple',
    envVar: 'FOLDER_CORE_PRINCIPLE',
    key: process.env.FOLDER_CORE_PRINCIPLE ?? '0d0b8481337c4a65acbd860ef00f3fee',
  },
  {
    copyType: 'Jurisdictional Override',
    contentType: 'PrgvJurisdictionalOverride',
    envVar: 'FOLDER_JURISDICTIONAL_OVERRIDE',
    key: process.env.FOLDER_JURISDICTIONAL_OVERRIDE ?? 'a6fb9dbbe05144d4b6c7d8609f20d810',
  },
  {
    copyType: 'Statutory Disclosure',
    contentType: 'PrgvStatutoryDisclosure',
    envVar: 'FOLDER_STATUTORY_DISCLOSURE',
    key: process.env.FOLDER_STATUTORY_DISCLOSURE ?? '03692842eee843ecbe36611ab46f2174',
  },
  {
    copyType: 'Procedural Safeguard',
    contentType: 'PrgvProceduralSafeguard',
    envVar: 'FOLDER_PROCEDURAL_SAFEGUARD',
    key: process.env.FOLDER_PROCEDURAL_SAFEGUARD ?? 'a09729113d824a949acb9fe7c564d597',
  },
];
