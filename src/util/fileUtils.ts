import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {DistanceMode, DistanceRound} from './scenarioUtils';
import {updateFileAction} from '../redux/fileIndexReducer';
import {ReduxStoreType} from '../redux/mainReducer';
import {MIME_TYPE_DRIVE_FOLDER} from './constants';
import {FOLDER_MAP, FOLDER_MINI, FOLDER_TEMPLATE, GRID_NONE, MINI_HEIGHT} from './constants';

export interface OnProgressParams {
    loaded: number;
    total: number;
}

export interface FileSystemUser {
    displayName: string;
    emailAddress: string;
    permissionId: string;
    photoLink?: string;
    icon?: string;
    offline?: boolean;
    me?: boolean;
}

export enum GridType {
    NONE = 'NONE',
    SQUARE = 'SQUARE',
    HEX_VERT = 'HEX_VERT',
    HEX_HORZ = 'HEX_HORZ'
}
export interface WebLinkProperties {
    webLink?: string;
}

export enum TemplateShape {
    RECTANGLE = 'RECTANGLE',
    CIRCLE = 'CIRCLE',
    ARC = 'ARC',
    ICON = 'ICON'
}

export enum IconShapeEnum {
    comment = 'comment',
    account_balance = 'account_balance',
    home = 'home',
    lock = 'lock',
    lock_open = 'lock_open',
    build = 'build',
    star = 'star',
    place = 'place',
    cloud = 'cloud',
    brightness_2 = 'brightness_2',
    brightness_5 = 'brightness_5',
    assistant_photo = 'assistant_photo',
    close = 'close'
}

export enum PieceVisibilityEnum {
    HIDDEN = 1, FOGGED = 2, REVEALED = 3
}

export interface TemplateProperties extends TabletopObjectProperties, FromBundleProperties {
    templateShape: TemplateShape;
    colour: number;
    opacity: number;
    width: number;
    height: number;
    depth: number;
    angle?: number;
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    defaultVisibility: PieceVisibilityEnum;
    iconShape?: IconShapeEnum;
}

export type ScenarioObjectProperties = MapProperties | MiniProperties | TemplateProperties;

export function castTemplateProperties(properties: TemplateProperties): TemplateProperties {
    return (properties) ? {
        ...properties,
        colour: Number(properties.colour),
        opacity: Number(properties.opacity),
        width: Number(properties.width),
        height: Number(properties.height),
        depth: Number(properties.depth),
        angle: Number(properties.angle),
        offsetX: Number(properties.offsetX),
        offsetY: Number(properties.offsetY),
        offsetZ: Number(properties.offsetZ),
        defaultVisibility: properties.defaultVisibility === undefined ? PieceVisibilityEnum.FOGGED : Number(properties.defaultVisibility)
    } : {
        rootFolder: FOLDER_TEMPLATE,
        templateShape: TemplateShape.RECTANGLE,
        colour: 0x00ff00,
        opacity: 0.5,
        width: 1,
        height: 0,
        depth: 1,
        angle: 60,
        offsetX: 0,
        offsetY: 0,
        offsetZ: 0,
        defaultVisibility: PieceVisibilityEnum.FOGGED
    }
}

export interface MapProperties extends TabletopObjectProperties, FromBundleProperties, WebLinkProperties {
    width: number;
    height: number;
    gridType: GridType;
    gridColour: string;
    gridSize: number;
    gridHeight?: number;
    gridOffsetX: number;
    gridOffsetY: number;
    fogWidth: number;
    fogHeight: number;
    showGrid: boolean;
    gridScale?: number;
    gridUnit?: string;
    distanceMode?: DistanceMode;
    distanceRound?: DistanceRound;
}


export interface MiniProperties extends TabletopObjectProperties, FromBundleProperties, WebLinkProperties {
    width: number;
    height: number;
    aspectRatio: number;
    topDownX: number;
    topDownY: number;
    topDownRadius: number;
    standeeX: number;
    standeeY: number;
    standeeRangeX: number;
    standeeRangeY: number;
    scale: number;
    colour?: string;
    defaultVisibility: PieceVisibilityEnum;
}

export const defaultMiniProperties: MiniProperties = {
    rootFolder: FOLDER_MINI,
    width: 0,
    height: 0,
    aspectRatio: 1,
    topDownX: 0.5,
    topDownY: 0.5,
    topDownRadius: 0.5,
    standeeX: 0.5,
    standeeY: 0,
    standeeRangeX: +MINI_HEIGHT,
    standeeRangeY: MINI_HEIGHT,
    scale: 1,
    defaultVisibility: PieceVisibilityEnum.FOGGED
};



export function castMiniProperties(properties?: MiniProperties): MiniProperties;
export function castMiniProperties(properties?: TemplateProperties): TemplateProperties;
export function castMiniProperties(properties?: MiniProperties | TemplateProperties): MiniProperties | TemplateProperties;
export function castMiniProperties(properties?: MiniProperties | TemplateProperties): MiniProperties | TemplateProperties {
    return (!properties) ? defaultMiniProperties :
        isTemplateProperties(properties) ? castTemplateProperties(properties) : {
        ...defaultMiniProperties,
        ...properties,
        width: Number(properties.width),
        height: Number(properties.height),
        aspectRatio: Number(properties.aspectRatio),
        topDownX: Number(properties.topDownX),
        topDownY: Number(properties.topDownY),
        topDownRadius: Number(properties.topDownRadius),
        standeeX: Number(properties.standeeX),
        standeeY: Number(properties.standeeY),
        standeeRangeX: Number(properties.standeeRangeX),
        standeeRangeY: Number(properties.standeeRangeY),
        scale: Number(properties.scale) || 1,
        defaultVisibility: properties.defaultVisibility === undefined ? PieceVisibilityEnum.FOGGED : Number(properties.defaultVisibility),
        pageCrop: typeof(properties.pageCrop) === 'string' ? JSON.parse(properties.pageCrop) : properties.pageCrop
    };
}

export function castMapProperties(properties?: MapProperties): MapProperties {
    const gridColour = (properties?.gridColour) || GRID_NONE;
    return (properties) ? {
        ...properties,
        width: Number(properties.width),
        height: Number(properties.height),
        gridType: properties.gridType ? properties.gridType :
            gridColour === GRID_NONE ? GridType.NONE : GridType.SQUARE,
        gridColour,
        gridSize: Number(properties.gridSize),
        gridHeight: properties.gridHeight ? Number(properties.gridHeight) : undefined,
        gridOffsetX: Number(properties.gridOffsetX),
        gridOffsetY: Number(properties.gridOffsetY),
        fogWidth: Number(properties.fogWidth),
        fogHeight: Number(properties.fogHeight),
        showGrid: String(properties.showGrid) === 'true',
        pageCrop: typeof(properties.pageCrop) === 'string' ? JSON.parse(properties.pageCrop) : properties.pageCrop
    } : defaultMapProperties;
}

export const defaultMapProperties: MapProperties = {
    rootFolder: FOLDER_MAP,
    width: 0,
    height: 0,
    gridType: GridType.NONE,
    gridColour: GRID_NONE,
    gridSize: 32,
    gridOffsetX: 32,
    gridOffsetY: 32,
    fogWidth: 0,
    fogHeight: 0,
    showGrid: false
};


export interface FromBundleProperties {
    fromBundleId?: string;
    pageCrop?: {
        pdfMetadataId: string;
        page: number;
        rotation: number;
        top: number;
        left: number;
    }
}

export interface RootDirAppProperties {
    rootFolder: string;
    dataVersion: string;
}

export interface TabletopObjectProperties {
    rootFolder: string;
}

export interface TabletopFileAppProperties {
    gmFile: string;
}

export interface FileShortcut extends FromBundleProperties {
    shortcutMetadataId: string; // The metadataId of the original file this shortcut points to.
    ownedMetadataId: string; // The metadataId of the shortcut file itself.
}

export function isFileShortcut(metadata: any): metadata is FileMetadata<void, FileShortcut> {
    return metadata.properties && metadata.properties.shortcutMetadataId !== undefined;
}

export type AnyAppProperties = RootDirAppProperties | TabletopFileAppProperties | void;

export type AnyProperties = MiniProperties 
    | ScenarioObjectProperties 
    | FromBundleProperties 
    | WebLinkProperties 
    | FileShortcut 
    | TemplateProperties
    | void;

export interface FileMetadata<appPropT = AnyAppProperties, propT = AnyProperties> {
    id: string;
    name: string;
    trashed: boolean;
    parents: string[];
    mimeType?: string;
    thumbnailLink?: string;
    owners?: FileSystemUser[];
    resourceKey?: string;

    // Abstract storage for provider-specific metadata
    appData?: Record<string, any>;
    appProperties?: appPropT;
    properties?: propT;
    
    // Abstract storage for custom properties
    customProperties?: Record<string, any>;
}

export type AddFilesCallback = (files: FileMetadata[]) => void;


export interface FileAPIContext {
    fileAPI: FileAPI;
}

export interface FileAPI {
    initialiseFileAPI: (callback: (signedIn: boolean) => void, onError: (error: Error) => void) => void;
    signInToFileAPI: () => void;
    signOutFromFileAPI: () => void;
    getLoggedInUserInfo: () => Promise<FileSystemUser>;
    loadRootFiles: (addFilesCallback: AddFilesCallback) => Promise<void>;
    loadFilesInFolder: (id: string, addFilesCallback: AddFilesCallback) => Promise<void>;
    getFullMetadata: (id: string, accessKey?: string) => Promise<FileMetadata>;
    getFileModifiedTime: (id: string) => Promise<number>;
    createFolder: (folderName: string, metadata?: Partial<FileMetadata>) => Promise<FileMetadata>;
    uploadFile: (metadata: Partial<FileMetadata>, file: Blob, onProgress?: (progress: OnProgressParams) => void) => Promise<FileMetadata>;
    saveJsonToFile: (idOrMetadata: string | Partial<FileMetadata>, json: object) => Promise<FileMetadata>;
    uploadFileMetadata: (metadata: Partial<FileMetadata>, addParents?: string[], removeParents?: string[]) => Promise<FileMetadata>;
    createShortcut: (originalFile: Partial<FileMetadata> & {id: string}, newParents: string[]) => Promise<FileMetadata>;
    getFileContents: (metadata: Partial<FileMetadata>) => Promise<Blob>;
    getJsonFileContents: (metadata: Partial<FileMetadata>) => Promise<any>;
    makeFileReadableToAll: (metadata: Partial<FileMetadata>) => Promise<void>;
    findFilesWithAppProperty: (key: string, value: string) => Promise<FileMetadata[]>;
    findFilesWithProperty: (key: string, value: string) => Promise<FileMetadata[]>;
    findFilesContainingNameWithProperty: (name: string, key: string, value: string) => Promise<FileMetadata[]>;
    deleteFile: (metadata: Partial<FileMetadata>) => Promise<void>;
}


export function isTabletopFileAppProperties(appProperties: any): appProperties is TabletopFileAppProperties {
    return appProperties && appProperties.gmFile !== undefined;
}


// not sure if we need these anymore
// export function isTabletopFileMetadata(metadata: FileMetadata): boolean {
//     return metadata.appData && metadata.appData.gmFile !== undefined;
// }
// export function isTabletopFileMetadataFromDrive(metadata: any): boolean {
//     return metadata && metadata.appProperties && metadata.appProperties.gmFile !== undefined;
// }
export function isTabletopFileMetadata(metadata: any): metadata is FileMetadata<TabletopFileAppProperties, void> {
    return metadata && isTabletopFileAppProperties(metadata?.appProperties);
}

export function isWebLinkProperties(properties: any): properties is WebLinkProperties {
    return properties && properties.webLink !== undefined;
}

export function isTemplateProperties(properties: any): properties is TemplateProperties {
    return properties && properties.templateShape !== undefined;
}

export function isTemplateMetadata(metadata: any): metadata is FileMetadata<void, TemplateProperties> {
    return metadata && isTemplateProperties(metadata.properties);
}

export function isMiniProperties(properties: any): properties is MiniProperties {
    return properties && !isTemplateProperties(properties);
}

export function isMiniMetadata(metadata: any): metadata is FileMetadata<void, MiniProperties> {
    return metadata && isMiniProperties(metadata.properties);
}

export function anyPropertiesTooLong(properties: AnyAppProperties | AnyProperties): boolean {
    return !properties ? false :
        Object.keys(properties).reduce<boolean>((result, key) => 
            (result || key.length + (properties as any)[key].length > 124), false);
}

export function isMetadataOwnedByMe(metadata: FileMetadata) {
    return metadata.owners && metadata.owners.reduce((acc, owner) => (!!acc || !!owner?.me), false)
}

export async function updateFileMetadataAndDispatch(fileAPI: FileAPI, metadata: Partial<FileMetadata> | any, dispatch: ThunkDispatch<ReduxStoreType, {}, AnyAction>, transmit: boolean = false): Promise<FileMetadata> {
    let fileSystemMetadata = await fileAPI.uploadFileMetadata(metadata);
    if (isTabletopFileMetadata(fileSystemMetadata)) {
        // If there's an associated gmFile, update it as well
        dispatch(updateFileAction(fileSystemMetadata, transmit ? fileSystemMetadata.id : undefined));
        fileSystemMetadata = await fileAPI.uploadFileMetadata({...metadata, id: fileSystemMetadata.appData!.gmFile});
    }
    dispatch(updateFileAction(fileSystemMetadata, transmit ? fileSystemMetadata.id : undefined));
    return fileSystemMetadata;
}

export function splitFileName(fileName: string): {name: string, suffix: string} {
    const match = fileName.match(/^(.*)(\.[a-zA-Z0-9]*)$/);
    if (match) {
        return {name: match[1] || '', suffix: match[2] || ''};
    } else {
        return {name: fileName, suffix: ''};
    }
}

// CORS proxy for web link maps and minis
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export function corsUrl(url: string) {
    return (url[0] === '/') ? url : CORS_PROXY + url;
}

export function isSupportedVideoMimeType(mimeType?: string) {
    return (mimeType === 'video/mp4' || mimeType === 'video/webm');
}

export function sortMetadataIdsByName(fileSystemMetadata: {[id: string]: FileMetadata}, metadataIds: string[] = []): string[] {
    return metadataIds
        .filter((id) => (fileSystemMetadata[id]))
        .sort((id1, id2) => {
            const file1 = fileSystemMetadata[id1];
            const file2 = fileSystemMetadata[id2];
            const isFolder1 = (file1.mimeType === MIME_TYPE_DRIVE_FOLDER);
            const isFolder2 = (file2.mimeType === MIME_TYPE_DRIVE_FOLDER);
            if (isFolder1 && !isFolder2) {
                return -1;
            } else if (!isFolder1 && isFolder2) {
                return 1;
            } else {
                return file1.name < file2.name ? -1 : (file1.name === file2.name ? 0 : 1);
            }
        });
}