#!/usr/bin/env bash
#
# Sync Template Branches
#

readonly SCRIPT_ROOT=$(dirname ${BASH_SOURCE})

source utils.sh

utils::properties::readAll "../template.properties"

utils::echo_info "Is this a template project? $TEMPLATE_PROJECT"
utils::echo_info "Template upstream url is $UPSTREAM_URL"

utils::echo_highlight "------------------------------------------"
utils::echo_highlight "        Syncing Template Branches         "
utils::echo_highlight "------------------------------------------"


# Check if an upstream URL is configured
if [[ "${UPSTREAM_URL}" == "null" ]]; then
    utils::echo_error "No upstream URL is configured."
    exit 1
fi

# Check if the required 'upstream' remote is present and if it does match the one configured.
# Create it otherwise.
if [[ `git remote | grep upstream` == "upstream" ]]; then
    # upstream remote is present, is it pointing to the correct URL?
    if [[ `git remote get-url upstream` == "${UPSTREAM_URL}" ]]; then
        utils::echo_info "> Git: The 'upstream' remote is correctly defined."
    else
        utils::echo_error "> Git: The 'upstream' remote is pointing to a URL different then configured."
        utils::echo_error "Actual     URL: " `git remote get-url upstream`
        utils::echo_error "Configured URL: ${UPSTREAM_URL}"
        exit 1
    fi
else
    # upstream remote is missing, create it
    utils::exec_or_exit "> Git: The 'upstream' remote is missing. Creating it" git remote add upstream ${UPSTREAM_URL}
fi

utils::exec_or_exit "> Git: Fetch latest changes from remotes" git fetch --prune --all

#
# Iterate over all remote branches that begin with 'template' and come from the 'upstream' remote.
#
for template_remote_branch in $(git branch --all | grep "remotes/upstream/template"); do
    # plain branch name without 'template' prefix or remote name
    target_local_branch=${template_remote_branch#"remotes/upstream/template/"}

    # remote branch within the "own" remote repo (origin)
    # if this is a template repo, then this will be like "origin/template/master", otherwise "origin/master"
    if [[ "${TEMPLATE_PROJECT}" == "true" ]]; then
        target_remote_branch="origin/template/${target_local_branch}"
    else
        target_remote_branch="origin/${target_local_branch}"
    fi

    commit_diff=$(git rev-list --left-right --count ${template_remote_branch}...${target_remote_branch})
    template_commits_ahead=$(echo $commit_diff | awk '{print $1}')
    utils::echo_info "> Template branch $template_remote_branch is $template_commits_ahead commits ahead."

    if [[ "$template_commits_ahead" -gt 0 ]] ; then
        template_commit_hash=$(git rev-parse --short=8 ${template_remote_branch})
        feature_branch_name="feature/merge-template-${template_remote_branch#"remotes/upstream/template/"}-${template_commit_hash}"

        if ! git branch --all | grep "remotes/origin/${feature_branch_name}" ; then
            if git branch --all | grep "${feature_branch_name}" ; then
                utils::exec_or_exit "> Git: Remove existing local feature branch ${feature_branch_name}" git branch -D ${feature_branch_name}
            fi
            utils::exec_or_exit "> Git: Checkout ${target_remote_branch}" git checkout ${target_remote_branch}
            utils::exec_or_exit "> Git: Create feature ${feature_branch_name}" git checkout -b ${feature_branch_name}
            utils::exec_or_exit "> Git: Merge template branch into feature branch" git merge --no-ff ${template_remote_branch}
            utils::exec_or_exit "> Git: Push feature branch" git push -u origin ${feature_branch_name}
            utils::echo_success "> Feature merge template branch '$feature_branch_name' sucessfully created."
        else
            utils::echo_success "> Nothing to do. Feature merge template branch '$feature_branch_name' already exists on remote."
        fi
    else
        utils::echo_success "> Nothing to do. Template branch and target branch already in sync."
    fi
done
