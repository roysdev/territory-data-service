import { gql } from 'apollo-server-express';
import { merge } from 'lodash';

import {
  Address,
  AddressInput,
  queryResolvers as addressQueryResolvers,
  mutationResolvers as addressMutationResolvers,
} from './types/Address';
import { Congregation, resolvers as congregationResolvers } from './types/Congregation';
import { 
  Territory,
  queryResolvers as territoryQueryResolvers,
  mutationResolvers as territoryMutationResolvers,
} from './types/Territory';
import { Publisher, queryResolvers as publisherQueryResolvers } from './types/Publisher';
import { Status } from './types/Status';
import {
  ActivityLog, 
  ActivityLogInput,
  resolvers as activityLogResolvers,
  mutationResolvers as activityLogMutationResolvers,
} from './types/ActivityLog';
import {
  AssignmentRecord,
  resolvers as assignmentRecordResolvers,
} from './types/AssignmentRecord';
import {
  AddressChangeLog,
  resolvers as changeLogResolvers,
} from './types/AddressChangeLog';
import {
  Phone,
  PhoneInput,
  queryResolvers as phoneQueryResolvers,
  mutationResolvers as phoneMutationResolvers,
} from './types/Phone';

const RootQuery = gql`
  type RootQuery {
    user(username: String): Publisher
    publisher(firstname: String, lastname: String, publisherId: Int, congId: Int): Publisher
    publishers(congId: Int, keyword: String): [Publisher]
    creator: Publisher
    updater: Publisher
    congregation(id: Int!): Congregation
    congregations(keyword: String): [Congregation]
    territory(id: Int): Territory
    territories(congId: Int, keyword: String, city: String, group_code: String): [Territory]
    territoriesByCity(congId: Int): [Territory]
    status(territoryId: Int): Status
    city: String
    address(id: Int, status: String): Address
    addresses(congId: Int, terrId: Int, keyword: String): [Address]
    inactiveAddresses(congId: Int, terrId: Int, keyword: String): [Address]
    dnc(congId: Int, keyword: String): [Address]
    activityLog(id: Int): ActivityLog
    activityLogs(checkout_id: Int, address_id: Int): [ActivityLog]
    getAssignmentRecords(congId: Int): [AssignmentRecord]
    optimize(territoryId: Int!, start: Float, end: Float): [Address],
    lastActivity(territoryId: Int, addressId: Int): ActivityLog,
    nearestAddresses(congId: Int, coordinates: [Float], radius: Int, unit: String, skip: Int, take: Int): [Address],
    groups: [String],
    addressChangeLogs(congId: Int, recordId: Int, minDate: String): [AddressChangeLog],
    phone(id: Int, status: String): Phone,
    phones(congId: Int, parentId: Int, terrId: Int, keyword: String): [Phone],
  }
`;

const Mutation = gql`
  type Mutation {
    checkoutTerritory(territoryId: Int!, publisherId: Int!, user: String): Territory
    checkinTerritory(territoryId: Int!, publisherId: Int!, user: String): Territory
    addAddress(address: AddressInput!): Address
    updateAddress(address: AddressInput!): Address
    updateSort(addressIds: [Int]!, userid: Int): Boolean
    changeAddressStatus(addressId: Int!, status: String!, userid: Int!, note: String): Boolean
    addNote(addressId: Int!, userid: Int!, note: String!): Boolean
    removeNote(addressId: Int!, userid: Int!, note: String!): Boolean
    addLog(activityLog: ActivityLogInput): ActivityLog
    updateLog(activityLog: ActivityLogInput): ActivityLog
    removeLog(id: Int!): Boolean
    addPhone(phone: PhoneInput!): Phone
    updatePhone(phone: PhoneInput!): Phone
    updatePhoneSort(phoneIds: [Int]!, userid: Int): Boolean
    changePhoneStatus(phoneId: Int!, status: String!, userid: Int!, note: String): Boolean
    addPhoneTag(phoneId: Int!, userid: Int!, note: String!): Boolean
    removePhoneTag(phoneId: Int!, userid: Int!, note: String!): Boolean
  }
`;

const SchemaDefinition = gql`
  schema {
    query: RootQuery
    mutation: Mutation
  }
`;

export const resolvers = {
  RootQuery: merge (
    {}, 
    publisherQueryResolvers,
    congregationResolvers,
    territoryQueryResolvers,
    addressQueryResolvers,
    activityLogResolvers,
    assignmentRecordResolvers,
    changeLogResolvers,
    phoneQueryResolvers,
  ),

  Mutation: merge (
    {},
    territoryMutationResolvers,
    activityLogMutationResolvers,
    addressMutationResolvers,
    phoneMutationResolvers,
  ),

  Publisher: {
    congregation: congregationResolvers.congregation,
    territories: territoryQueryResolvers.territories,
  },

  Congregation: {
    territories: territoryQueryResolvers.territories,
    publishers: publisherQueryResolvers.publishers,
    groups: congregationResolvers.groups,
  },

  Territory: {
    addresses: addressQueryResolvers.addresses,
    inactiveAddresses: addressQueryResolvers.inactiveAddresses,
    status: territoryQueryResolvers.status,
    city: territoryQueryResolvers.city,
    lastActivity: territoryQueryResolvers.lastActivity,
    phones: phoneQueryResolvers.phones,
  },

  Address: {
    congregation: congregationResolvers.congregation,
    territory: territoryQueryResolvers.territory,
    activityLogs: activityLogResolvers.activityLogs,
    creator: publisherQueryResolvers.creator,
    updater: publisherQueryResolvers.updater,
    lastActivity: addressQueryResolvers.lastActivity,
    phones: phoneQueryResolvers.phones,
  },

  Status: {
    publisher: publisherQueryResolvers.publisher,
    territory: territoryQueryResolvers.territory,
  },

  AddressChangeLog: {
    publisher: publisherQueryResolvers.publisher,
    address: addressQueryResolvers.address,
  },
}

export const typeDefs = [
  SchemaDefinition,
  RootQuery,
  Mutation,
  Congregation,
  Territory,
  Publisher,
  Address,
  AddressInput,
  Status,
  ActivityLog,
  ActivityLogInput,
  AssignmentRecord,
  AddressChangeLog,
  Phone,
  PhoneInput,
];
