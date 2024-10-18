import { provideApolloClient } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { apolloClient } from "./apolloClient";

provideApolloClient(apolloClient);

export const getAllSpaceGroups = async () => {
  const { data } = await apolloClient.query({
    query: gql`
      {
        paginate_group(page: 1, perPage: 100) {
          data {
            id
            name
          }
        }
      }
    `,
    fetchPolicy: "cache-first",
  });
  return data.paginate_group.data;
};

export const getGroupMembers = async (groupId) => {
  const { data } = await apolloClient.query({
    query: gql`
      query ($id: String!) {
        get_group(id: $id) {
          subject {
            object {
              id
              fullname {
                first_name
                last_name
              }
              email {
                email
              }
            }
          }
        }
      }
    `,
    variables: { id: groupId },
    fetchPolicy: "network-only",
  });
  return data.get_group.subject.map((item) => item.object);
};

export const getAllSpacePages = async () => {
  const { data } = await apolloClient.query({
    query: gql`
      query {
        pages(perPage: 255) {
          data {
            title
            id
            parent_id
          }
        }
      }
    `,
    fetchPolicy: "network-only",
  });
  return data.pages.data;
};

export const getAllTasks = async () => {
  const { data } = await apolloClient.query({
    query: gql`
      {
        paginate_task(page: 1, perPage: 100) {
          data {
            name
            task_description
            worker {
              object {
                fullname {
                  first_name
                  last_name
                }
              }
            }
            status
          }
          paginatorInfo {
            count
          }
        }
      }
    `,
    fetchPolicy: "network-only",
  });

  return data.paginate_task.data;
};

export const getModules = async () => {
  const { data } = await apolloClient.query({
    query: gql`
      query {
        paginate_module(page: 1, perPage: 255) {
          data {
            id
            module_name
            answerable {
              object {
                fullname {
                  first_name
                  last_name
                }
              }
            }
            start_date
            end_date
            tasks {
              object {
                name
              }
            }
            id
          }
          paginatorInfo {
            count
          }
        }
      }
    `,
    fetchPolicy: "network-only",
  });
  return data.paginate_module.data;
};

export const getModule = async (moduleId) => {
  const { data } = await apolloClient.query({
    query: gql`
      query ($id: String!) {
        get_module(id: $id) {
          id
          name
          module_name
          start_date
          end_date
          tasks {
            object {
              id
              name
            }
          }
        }
      }
    `,
    variables: { id: moduleId },
    fetchPolicy: "network-only",
  });

  return data.get_module;
};

export const inviteUser = async (input) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation InviteUser($input: SpaceInviteUserInput!) {
        spaceInviteUser(input: $input) {
          status
        }
      }
    `,
    variables: { input },
  });
  return data.spaceInviteUser;
};

export const deleteModule = async (id) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation deleteModule($id: String!) {
        delete_module(id: $id) {
          status
          recordId
        }
      }
    `,
    variables: { id },
  });
  return data.delete_module;
};

export const createModule = async (input) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation ($input: create_module_input!) {
        create_module(input: $input) {
          status
          record {
            id
            name
            module_name
            answerable {
              object {
                fullname {
                  first_name
                  last_name
                }
              }
            }
            start_date
            end_date
          }
        }
      }
    `,
    variables: { input },
  });
  return data.create_module;
};

export const createTask = async (input) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation ($input: create_task_input!) {
        create_task(input: $input) {
          status
          record {
            id
            name
            task_description
            worker {
              object {
                fullname {
                  first_name
                  last_name
                }
              }
            }
            status
            for_module {
              object {
                id
                name
              }
            }
          }
        }
      }
    `,
    variables: { input },
  });
  return data.create_module;
};

export const userSignIn = async (input) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation UserSignIn($input: UserSignInInput!) {
        userSignIn(input: $input) {
          recordId
          record {
            token_type
            expires_in
            access_token
            refresh_token
          }
          status
        }
      }
    `,
    variables: { input },
  });
  return data;
};

export const getMyUserData = async () => {
  const { data } = await apolloClient.query({
    query: gql`
      query userMy {
        userMy {
          id
          current_space_id
          email
          name
          surname
          socials
          spaces
          avatar
          birthdate
          last_space_id
          telegram_chat_id
          config {
            theme
            telegramNotify
            sortSpaces
            meetingRoom
            headerIcons
            timezone
            headerIconsMobile
            locale
            __typename
          }
          updated_at
          created_at
          deleted_at
        }
      }
    `,
    fetchPolicy: "network-only",
  });
  return data;
};
