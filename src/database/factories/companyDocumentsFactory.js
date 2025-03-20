const { faker } = require('@faker-js/faker');
const CompanyDocuments = require('../../models/CompanyDocument');
const companyFactory = require('./companyFactory');

const companyDocumentsFactory = {
  async create(count = 1, attrs = {}) {
    const documents = [];
    
    // Create company if company_id not provided
    if (!attrs.company_id) {
      const companies = await companyFactory.create(1);
      attrs.company_id = companies[0].company_id;
    }
    
    for (let i = 0; i < count; i++) {
      const documentData = this.makeOne(attrs);
      documents.push(await CompanyDocuments.create(documentData));
    }
    
    return documents;
  },
  
  makeOne(attrs = {}) {
    const docTypes = ['business_license', 'tax_certificate', 'insurance_document', 'ownership_proof'];
    
    const defaultAttrs = {
      document_type: faker.helpers.arrayElement(docTypes),
      document_url: faker.internet.url() + '/' + faker.system.commonFileName('pdf'),
      upload_date: faker.date.past()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const documents = [];
    
    for (let i = 0; i < count; i++) {
      documents.push(this.makeOne(attrs));
    }
    
    return documents;
  }
};

module.exports = companyDocumentsFactory;
