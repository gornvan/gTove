import { FileMetadata, FileSystemUser } from "./model";
import { OnProgressParams } from "./model";

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
