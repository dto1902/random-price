import React, {useCallback, useState} from 'react';
import {Avatar, Card, Popover, ResourceList, TextField} from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_CUSTOMERS = gql`
query ($query: String!){
  customers(first: 10, query: $query) {
    edges {
      node {
        firstName
        lastName
        email
        id
      }
    }
  }
}
`

function FindOrCreateCustomer() {
  const [popoverActive, setPopoverActive] = useState(false);
  const [visibleStaffIndex, setVisibleStaffIndex] = useState(5);
  const [value, setValue] = useState('');
  const handleChange = useCallback((newValue) => setValue(newValue), []);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );
  const openPopoverActive = useCallback(
    () => setPopoverActive(true),
    [],
  );
return(
  <Query query={GET_CUSTOMERS} variables={{ query: value }}>
    {({ data, loading, error }) => { // Refetches products by ID
      if (loading) return 'Loading...';
      if (error) return <p>{error.message}</p>;
      
      const customerById = {};
      data.customers.edges.forEach(customer => customerById[customer.node.id] = customer);
      
      const staff = data.customers.edges.map(getNames);
      function getNames(names) {
        return `${names.node.firstName} ${names.node.lastName}`;
      };

      console.log(value)
      //console.log(arrayCustomersNames)
      // const staff = [
      //   'Abbey Mayert',
      //   'Abbi Senger',
      //   'Abdul Goodwin',
      //   'Abdullah Borer',
      //   'Abe Nader',
      //   'Abigayle Smith',
      //   'Abner Torphy',
      //   'Abraham Towne',
      //   'Abraham Vik',
      //   'Ada Fisher',
      //   'Adah Pouros',
      //   'Adam Waelchi',
      //   'Adan Zemlak',
      //   'Addie Wehner',
      //   'Addison Wexler',
      //   'Alex Hernandez',
      // ];
      const activator = (
        <TextField
        label="Store name"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        onFocus={openPopoverActive}
      />
      );
      const handleScrolledToBottom = () => {
        const totalIndexes = staff.length;
        const interval =
          visibleStaffIndex + 3 < totalIndexes
            ? 3
            : totalIndexes - visibleStaffIndex;
    
        if (interval > 0) {
          setVisibleStaffIndex(visibleStaffIndex + interval);
        }
      };
      const staffList = staff.slice(0, visibleStaffIndex).map((name) => ({
        name,
        initials: getInitials(name),
      }));
      function renderItem({name, initials}) {
        return (
          <ResourceList.Item
            id={name}
            media={<Avatar size="medium" name={name} initials={initials} />}
            onClick={handleResourceListItemClick}
          >
            {name}
          </ResourceList.Item>
        );
      }
      function getInitials(name) {
        return name
          .split(' ')
          .map((surnameOrFamilyName) => {
            return surnameOrFamilyName.slice(0, 1);
          })
          .join('');
      }
      const handleResourceListItemClick = (name) => {
        console.log(name);
        setValue(name)
        setPopoverActive(!popoverActive)
      };
      return (
        <Card sectioned>
          <div style={{width: '100' + '%'}}>
              <Popover
                sectioned
                active={popoverActive}
                activator={activator}
                onClose={togglePopoverActive}
                ariaHaspopup={false}
              >
                <Popover.Pane onScrolledToBottom={handleScrolledToBottom}>
                  <ResourceList items={staffList} renderItem={renderItem} />
                </Popover.Pane>
              </Popover>
          </div>
        </Card>
      );
    }}
  </Query>
  )
}
export { FindOrCreateCustomer }