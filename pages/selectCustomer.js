import React, {useCallback, useState} from 'react';
import {Autocomplete, Icon, TextField} from '@shopify/polaris';
import {CirclePlusMinor, SearchMinor} from '@shopify/polaris-icons';
import { Query } from '@apollo/react-components';
import gql from 'graphql-tag';

const GET_CUSTOMERS = gql`
query name($query: String){
  customers(query: $query, first: 10) {
    edges {
      node {
        id
        firstName
        lastName
        email
        phone
      }
    }
  }
  }
`

export default function AutocompleteActionBeforeExample() {
  const deselectedOptions = [
    {value: 'rustic', label: 'Rustic'},
    {value: 'antique', label: 'Antique'},
    {value: 'vinyl', label: 'Vinyl'},
    {value: 'vintage', label: 'Vintage'},
    {value: 'refurbished', label: 'Refurbished'},
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);
  const [loading, setLoading] = useState(false);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (!loading) {
        setLoading(true);
      }

      setTimeout(() => {
        if (value === '') {
          setOptions(deselectedOptions);
          setLoading(false);
          return;
        }
        const filterRegex = new RegExp(value, 'i');
        const resultOptions = options.filter((option) =>
          option.label.match(filterRegex),
        );
        setOptions(resultOptions);
        setLoading(false);
      }, 300);
    },
    [deselectedOptions, loading, options],
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedText = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });
      setSelectedOptions(selected);
      setInputValue(selectedText[0]);
    },
    [options],
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Tags"
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="inkLighter" />}
      placeholder="Search"
    />
  );

  return (
    <div style={{height: '225px'}}>
      <Autocomplete
        actionBefore={{
          accessibilityLabel: 'Action label',
          badge: {
            status: 'new',
            content: 'New!',
          },
          content: 'Action with long name',
          ellipsis: true,
          helpText: 'Help text',
          icon: CirclePlusMinor,
        }}
        options={options}
        selected={selectedOptions}
        onSelect={updateSelection}
        listTitle="Suggested tags"
        loading={loading}
        textField={textField}
      />
    </div>
  );
}