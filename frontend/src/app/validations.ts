// Validate username.
export function validateUsername(username: string) {
    let error = "";
    if (username.length === 0) {
        error = "Username is required."
    } else if (!username.match(/^\w*$/)) {
        error = "Username cannot contain special characters."
    } else if (username.length > 20) {
        error = "Username too long. Maximum 20 characters."
    }
    return error
}

// Validate email.
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
export function validateEmail(email: string) {
    let error = "";
    if (email.length === 0) {
        error = "Email is required."
    } else if (!email.match(emailRegex)) {
        error = "Email not valid."
    }
    return error
}

// Validate password.
export function validatePassword(password: string, confirmPassword: string) {
    let error = "";
    if (password.length === 0) {
        error = "Password is required."
    } else if (password !== confirmPassword) {
        error = "Password and Confirm Password do not match."
    }
    return error
}

// Validate about.
export function validateAbout(about: string) {
    let error = "";
    if (about.length > 1000) {
        error = "About too long. Maximum 1000 characters."
    }
    return error
}

// Validate title.
export function validateTitle(title: string) {
    let error = "";
    if (title.length === 0) {
        error = "Title is required."
    } else if (title.length > 255) {
        error = "Title too long. Maximum 255 characters."
    }
    return error
}

// Validate post content.
export function validatePostContent(content: string) {
    let error = "";
    if (content.length === 0) {
        error = "Content is required." 
    } else if (content.length > 50000) {
        error = "Content too long. Maximum 50 000 characters."
    }
    return error
}

// Validate comment or reply content.
export function validateContent(content: string) {
    let error = "";
    if (content.length === 0) {
        error = "Content is required."
    } else if (content.length > 255) {
        error = "Content too long. Maximum 255 characters."
    }
    return error
}

// Validate tag.
export function validateTag(tag: string, tags: string[]) {
    let error = "";
    if (tag.length === 0) {
        error = "Tag cannot be empty."
    } else if (!tag.match(/^\w*$/)) {
        error = "Tag cannot contain special characters."
    } else if (tag.length > 10) {
        error = "Tag too long. Maximum 10 characters."
    } else if (tags.includes(tag)) {
        error = "Tag must be unique."
    }
    return error;
}