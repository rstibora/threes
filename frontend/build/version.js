import { execSync } from "child_process"


export function getGitInfo() {
    return {
        hash: execSync("git log -1 --pretty=format:%h").toString().trim(),
        tag: execSync("git tag --points-at HEAD").toString().trim(),
        date: execSync("git log -1 --pretty=format:%ci").toString().trim(),
        isClean: execSync("git status . --untracked-files=no --porcelain").toString().trim().length === 0    
    }
}
