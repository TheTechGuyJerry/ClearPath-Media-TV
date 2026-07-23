export interface NewsArticle {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  description: string;
  accentColor: string; // e.g. '#e28743' for gold/orange accent line
  articles: NewsArticle[];
}

export const PUBLICATIONS_DATA: Record<string, Publication> = {
  'clearpath-daily': {
    id: 'clearpath-daily',
    title: 'ClearPath Daily',
    slug: 'clearpath-daily',
    description: 'Explore ClearPath Daily\'s weekday briefings on Nigeria\'s politics, economy, governance, and public policy, designed to deliver high-impact analysis before the day begins.',
    accentColor: '#e28743', // Warm gold
    articles: [
      {
        id: 'cpd-1',
        category: 'ENERGY & ECONOMY',
        title: 'The Subsidy Conundrum: Navigating Nigeria\'s Energy Inflation',
        author: 'Annabel Orji',
        date: 'July 17, 2026',
        excerpt: 'An in-depth review of recent energy pricing policies, transport overheads, and the fiscal trade-offs facing state administrators.',
        content: `### The Subsidy Conundrum: Navigating Nigeria's Energy Inflation

For decades, fuel subsidies represented a critical, albeit fiscally draining, component of the social contract in Nigeria. The sudden policy pivot to dismantle this regime has sparked a complex macroeconomic shift. While the federal government has clawed back billions in monthly savings, the secondary shocks have propagated swiftly through the domestic economy.

#### Transport Overheads and Local Logistics
The immediate casualty of rising petrol prices is the transport sector. Inter-state logistics costs have soared by upwards of 120%, directly impacting food supply chains. Agricultural produce moving from northern breadbaskets to southern urban centers now incurs premium transport rates, elevating food inflation to historic levels.

#### Sub-National Fiscal Allocations
A key argument for the subsidy removal was the promise of enhanced allocations to states and local government areas via the Federation Account Allocation Committee (FAAC). While state capitals are indeed reporting significantly higher nominal revenues, the purchasing power of these funds has been eroded by inflation and exchange rate depreciation.

#### The Policy Path Forward
To cushion the impact, experts recommend a phased investment in Compressed Natural Gas (CNG) public transport corridors and direct agricultural input subsidies. Without structural buffers, the fiscal space gained from subsidy removal risk being swallowed by systemic public discontent and declining consumer demand.`,
        coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 'cpd-2',
        category: 'DEMOCRACY & GOVERNANCE',
        title: 'Electoral Act Reforms: Building Trust in Post-Election Technology',
        author: 'Annabel Orji',
        date: 'July 15, 2026',
        excerpt: 'How ongoing legislative proposals aim to digitize result transmission and secure voter verification processes.',
        content: `### Electoral Act Reforms: Building Trust in Post-Election Technology

As Nigeria approaches its mid-term governance reviews, the debate surrounding the modernization of the electoral process has returned to the legislative forefront. The National Assembly is currently considering a series of amendments aimed at strengthening the statutory framework for electronic voting and transmission.

#### Digitizing Result Transmission
The core of the new proposals centers on making real-time upload of polling unit results a non-negotiable statutory requirement. By removing administrative discretion in the result collation chain, proponents argue that public confidence in election outcomes can be substantially restored.

#### Cybersecurity and Audit Trails
With increased technological dependence comes heightened exposure to digital vulnerabilities. The draft bill mandates regular, independent third-party audits of the electoral commission’s servers and backend databases. Furthermore, it outlines strict guidelines for forensic data preservation in the event of judicial challenges.

#### Public Outlook
Civil society organizations have largely welcomed the amendments but remain cautious about implementation timelines. "The technology itself is only as reliable as the institutional trust surrounding its operation," noted a lead policy analyst at ClearPath Media.`,
        coverImage: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  'west-african-monitor': {
    id: 'west-african-monitor',
    title: 'West African Monitor',
    slug: 'west-african-monitor',
    description: 'Providing comprehensive analysis on West African regional integration, diplomatic relations, ECOWAS policy directions, and trans-border security developments.',
    accentColor: '#10b981', // Forest Green
    articles: [
      {
        id: 'wam-1',
        category: 'REGIONAL SECURITY',
        title: 'The ECOWAS Conundrum: Balancing Regional Sanctions with Diplomatic Backchannels',
        author: 'Regional Affairs Desk',
        date: 'July 16, 2026',
        excerpt: 'As geopolitical tensions shift in the Sahel, West African leaders seek consensus on cross-border counter-terrorism frameworks.',
        content: `### The ECOWAS Conundrum: Balancing Regional Sanctions with Diplomatic Backchannels

The Economic Community of West African States (ECOWAS) is facing one of its most severe institutional stress tests in recent history. The delicate balance between enforcing democratic norms and maintaining regional cohesion is pushing diplomatic corps into unprecedented negotiations.

#### The Sahel Geopolitical Shift
Recent transitions in several member states have led to the formation of alternative regional alliances, challenging the traditional authority of the Abuja-based commission. These geopolitical realignments threaten long-standing intelligence-sharing pacts that are crucial for countering insurgency in the Lake Chad and Liptako-Gourma regions.

#### Economic Realities of Border Friction
Sanctions and border closures have historically proven to be double-edged swords. Border communities in northern Nigeria and southern Niger have experienced dramatic trade disruptions, leading to rising commodity prices and smuggling.

#### Active Backchannel Diplomacy
In response, ECOWAS diplomats are increasingly relying on traditional rulers, religious leaders, and elder statesmen to maintain communication lines. These backchannels offer a flexible, low-stakes environment to negotiate transition timelines and restore economic corridors without public loss of face.`,
        coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 'wam-2',
        category: 'REGIONAL ECONOMICS',
        title: 'Cross-Border Trade: The Real Impact of the AfCFTA on Nigeria-Benin Corridors',
        author: 'Regional Affairs Desk',
        date: 'July 14, 2026',
        excerpt: 'Examining customs harmonization, currency dynamics, and logistical bottlenecks at the Seme border.',
        content: `### Cross-Border Trade: The Real Impact of the AfCFTA on Nigeria-Benin Corridors

While the African Continental Free Trade Area (AfCFTA) promises a frictionless continental market, the ground-level realities at West African border crossings tell a more complex story. The historic trade corridor between Seme (Nigeria) and Cotonou (Benin) serves as an instructive case study.

#### Customs Harmonization Hurdles
Despite multi-lateral agreements, discrepancies in cargo inspection protocols, tariff classifications, and transit documentation persist. Traders continue to navigate duplicate clearing processes that add days to delivery schedules and inflate transaction costs.

#### Currency Volatility and Settlement Systems
The absence of a unified regional currency remains a major challenge. However, the gradual rollout of the Pan-African Payment and Settlement System (PAPSS) is beginning to show utility, allowing transactions to be cleared in local currencies, reducing dependence on US Dollars.

#### Infrastructural Interventions
Both governments are currently investing in co-located border posts equipped with modern cargo scanners. Proponents argue that combining technology with simplified administrative protocols is the most realistic path to achieving the trade volumes envisioned by the AfCFTA.`,
        coverImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  'state-in-focus': {
    id: 'state-in-focus',
    title: 'State in Focus',
    slug: 'state-in-focus',
    description: 'A dedicated focus on sub-national governance, state-level economic reforms, internal revenue generation strategies, and state-backed infrastructure projects across Nigeria.',
    accentColor: '#3b82f6', // Bright Blue
    articles: [
      {
        id: 'sif-1',
        category: 'SUB-NATIONAL FINANCE',
        title: 'Lagos Megacity Expansion: Infrastructure Financing Beyond the Sovereign Balance Sheet',
        author: 'Urban Development Desk',
        date: 'July 16, 2026',
        excerpt: 'How Lagos State utilizes municipal bonds and private-public partnerships to fund deep-sea ports and light rail corridors.',
        content: `### Lagos Megacity Expansion: Infrastructure Financing Beyond the Sovereign Balance Sheet

With a population exceeding 20 million, Lagos State continues to operate as West Africa\'s economic engine. However, the capital required to sustain its rapid urban expansion far exceeds traditional budgetary provisions, prompting state planners to pioneer innovative financing structures.

#### The Municipal Bond Market
Lagos has successfully leveraged the domestic capital market by issuing long-term municipal bonds linked directly to revenue-yielding infrastructure projects. By assuring investors of ring-fenced escrow accounts tied to land use charges and transport receipts, the state has secured favorable borrowing rates.

#### Public-Private Partnerships (PPPs)
From the Lekki Deep Sea Port to the Blue and Red Line rail systems, PPPs have become the cornerstone of Lagos\'s development strategy. These arrangements distribute construction and operational risks to private consortia while guaranteeing long-term public access to critical services.

#### Replicability Across Other States
While Lagos enjoys a robust internal revenue base, other states are closely studying its financial architecture. Developing independent credit ratings and establishing transparent legal frameworks for concession agreements are essential prerequisites for any sub-national administration hoping to follow suit.`,
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 'sif-2',
        category: 'SUB-NATIONAL DEVELOPMENT',
        title: 'Agricultural Hubs: How Kaduna is Securing Rural Supply Chains',
        author: 'Agribusiness Analyst',
        date: 'July 12, 2026',
        excerpt: 'A look into Kaduna State\'s smallholder cooperative models and local processing facilities in the face of macro headwinds.',
        content: `### Agricultural Hubs: How Kaduna is Securing Rural Supply Chains

Kaduna State is consolidating its position as an agricultural powerhouse by investing in rural infrastructure and connecting smallholder farmers with industrial agro-processors. This localized supply chain model aims to reduce post-harvest losses and boost rural incomes.

#### The Cooperative Aggregation Model
Under the state-led initiative, individual farmers are organized into localized cooperatives. These cooperatives receive high-yield seeds, modernized storage silos, and guaranteed off-take contracts from major food manufacturing companies, removing pricing uncertainty.

#### Securing Trade Routes
A major bottleneck has been the safety of transport corridors from farms to urban markets. Kaduna State has established dedicated community-backed agricultural transit rangers to patrol feeder roads, securing the transit of goods and restoring confidence among farm laborers.

#### Impact on Local Agro-Processing
By stabilizing raw material supply, the state has attracted significant private investment in corn milling, ginger processing, and dairy production facilities. This industrial transition creates valuable off-farm employment opportunities for the local youth population.`,
        coverImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  'lga-brief': {
    id: 'lga-brief',
    title: 'LGA Brief',
    slug: 'lga-brief',
    description: 'Examining grassroots administration, local council reforms, and community-led development initiatives within Nigeria\'s 774 Local Government Areas.',
    accentColor: '#8b5cf6', // Purple
    articles: [
      {
        id: 'lga-1',
        category: 'GRASSROOTS REFORM',
        title: 'Fiscal Autonomy for LGAs: Implementing the Supreme Court Mandate',
        author: 'Local Governance Desk',
        date: 'July 15, 2026',
        excerpt: 'Analyzing the operational hurdles of direct federation account disbursements to Nigeria\'s 774 local government councils.',
        content: `### Fiscal Autonomy for LGAs: Implementing the Supreme Court Mandate

The landmark Supreme Court ruling granting direct fiscal autonomy to Nigeria\'s Local Government Areas (LGAs) was celebrated as a victory for grassroots democracy. However, translating judicial directives into operational local government administrations involves navigating complex political and administrative realities.

#### Dismantling State-Local Joint Accounts
For decades, state-local joint accounts allowed state governors to exercise significant control over LGA revenues. Dismantling this system requires establishing direct digital disbursement channels from the Federation Account to individual local council treasuries.

#### Capacity Constraints and Accountability
Many local councils suffer from severe administrative capacity deficits. Restructuring LGA finance operations necessitates comprehensive training for local treasurers, auditors, and administrators to ensure public funds are managed with high levels of transparency.

#### The Path Ahead
To prevent misuse, civil society groups are advocating for citizen-led budget monitoring committees in every local government ward. Real grassroots development can only occur when local communities possess the tools to hold their immediate leaders accountable.`,
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 'lga-2',
        category: 'LOCAL GOVERNANCE',
        title: 'Primary Healthcare in the Grassroots: Lessons from Oyo Local Councils',
        author: 'Public Health Desk',
        date: 'July 10, 2026',
        excerpt: 'How community-led funding models are restoring basic medicine supplies and maternal care centers in rural wards.',
        content: `### Primary Healthcare in the Grassroots: Lessons from Oyo Local Councils

In many rural communities, primary health centers (PHCs) represent the only line of defense against preventable diseases. In Oyo State, several local government councils are pioneering community-led funding partnerships that are successfully revitalizing these essential facilities.

#### Local Health Boards
Instead of relying solely on centralized state purchases, Oyo local councils have established community health boards consisting of local leaders, health workers, and citizens. These boards oversee facility maintenance and local pharmaceutical procurements.

#### Stabilizing Medicine Supply
A critical issue for rural clinics is the persistent stock-out of essential medicines. By establishing cooperative purchasing pools, local PHCs can buy quality pharmaceuticals in bulk, ensuring continuous supply and lowering costs for patients.

#### Encouraging Health Workers
To retain skilled medical staff in remote areas, councils have introduced localized incentive schemes, including subsidized staff quarters and performance-based allowances funded through local community contributions.`,
        coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  'governance-brief': {
    id: 'governance-brief',
    title: 'Governance Brief',
    slug: 'governance-brief',
    description: 'Rigorous policy analyses, public service delivery reviews, and institutional transparency audits aimed at strengthening governance outcomes in Nigeria.',
    accentColor: '#f59e0b', // Amber/Yellow
    articles: [
      {
        id: 'gov-1',
        category: 'PUBLIC SERVICE REFORM',
        title: 'Civil Service Digitization: Reducing Ghost Workers and Administrative Overhead',
        author: 'Institutional Reform Desk',
        date: 'July 17, 2026',
        excerpt: 'How the expansion of the Integrated Personnel and Payroll Information System (IPPIS) is shaping civil service efficiency.',
        content: `### Civil Service Digitization: Reducing Ghost Workers and Administrative Overhead

Public sector reform is a perennial challenge in developing economies, often hindered by bloated payrolls and bureaucratic inertia. In Nigeria, the systematic expansion of the Integrated Personnel and Payroll Information System (IPPIS) has emerged as a key lever for fiscal discipline.

#### The IPPIS Biometric Rollout
By mandating biometric verification for all federal civil servants, the IPPIS has successfully identified and eliminated thousands of non-existent employees from the public payroll. The resulting savings are being redirected toward capital infrastructure and retraining active public servants.

#### Transitioning to Digital Workflows
Beyond payroll, the federal civil service is gradually implementing electronic document management systems. This transition is slowly dismantling the paper-intensive bureaucratic processes that have historically delayed policy execution and fostered administrative corruption.

#### Institutional Resistance
The journey toward a modern civil service faces resistance from entrenched interests accustomed to legacy systems. Overcoming this requires sustained political will, robust cybersecurity frameworks, and a cultural shift within the civil service leadership.`,
        coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 'gov-2',
        category: 'FISCAL RESPONSIBILITY',
        title: 'The Cost of Governance: Legislative Expenditures and Public Accountability',
        author: 'Policy Analyst',
        date: 'July 13, 2026',
        excerpt: 'A data-backed review of public spending, administrative audits, and recommendations for budget rationalization.',
        content: `### The Cost of Governance: Legislative Expenditures and Public Accountability

The high cost of maintaining public institutions in Nigeria remains a subject of intense public debate. With a significant portion of national revenues allocated to recurrent expenditures, policy analysts are calling for a comprehensive review of government spending.

#### The Legislative Budget
Comparative studies indicate that Nigeria\'s federal legislature is among the most well-funded globally relative to gross national product. While a functional parliament is essential for democratic oversight, the scale of administrative allowances has drawn sharp criticism from civil society.

#### Auditing the Executive Bureaucracy
The executive branch also faces calls for reform. Overlapping mandates among numerous federal boards, departments, and agencies often lead to redundant expenditures and administrative conflict. Implementing the Oronsaye Report recommendations remains a critical priority.

#### Citizen-led Oversight
Sustained civic advocacy, supported by clear public finance data, is essential to push legislative and executive organs to implement fiscal reforms. Transitioning to transparent, itemized budget publications is a necessary first step toward building public trust.`,
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  'bccn-news': {
    id: 'bccn-news',
    title: 'BCCN News',
    slug: 'bccn-news',
    description: 'Covering sustainable business practices, renewable energy investments, and climate action policy initiatives driven by the Business Coalition for Climate Action.',
    accentColor: '#059669', // Emerald/Deep Green
    articles: [
      {
        id: 'bcc-1',
        category: 'GREEN ENERGY',
        title: 'Decarbonizing Nigeria\'s Energy Mix: The Role of Decentralized Solar Grids',
        author: 'Climate Coalition Desk',
        date: 'July 17, 2026',
        excerpt: 'As diesel costs soar, commercial and industrial sectors are transitioning to rooftop solar installations and hybrid storage.',
        content: `### Decarbonizing Nigeria's Energy Mix: The Role of Decentralized Solar Grids

Nigeria\'s industrial sector has long grappled with grid instability, relying heavily on expensive, high-emission diesel generators. However, a rapid drop in solar photovoltaic (PV) technology costs and rising fuel prices are driving a quiet green revolution.

#### The Commercial Transition
Major manufacturing firms in Lagos, Kano, and Port Harcourt are increasingly turning to hybrid solar-diesel configurations. These decentralized rooftop arrays allow businesses to offset up to 40% of their daily energy expenses while significantly reducing their carbon footprint.

#### Policy Incentives and Carbon Credits
The federal government\'s national renewable energy policy outlines tax exemptions and import tariff holidays for green power hardware. Additionally, pioneering firms are beginning to participate in regional voluntary carbon markets, turning their emissions reductions into secondary revenue streams.

#### Financing Obstacles
Despite high demand, the capital expenditure required for commercial-scale installations remains prohibitive for many small and medium-sized enterprises. Overcoming this requires specialized local financial institutions offering long-term, low-interest green loans.`,
        coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 'bcc-2',
        category: 'SUSTAINABILITY',
        title: 'Circular Economy in Action: Transforming Urban Waste in Port Harcourt',
        author: 'Climate Coalition Desk',
        date: 'July 11, 2026',
        excerpt: 'How local recycling startups are collaborating with corporate partners to establish scalable plastic-to-value supply chains.',
        content: `### Circular Economy in Action: Transforming Urban Waste in Port Harcourt

Urban waste management is an urgent environmental challenge in Nigeria\'s rapidly expanding cities. In Port Harcourt, the Business Coalition for Climate Action is backing local green entrepreneurs who are transforming plastic waste into high-value manufacturing inputs.

#### The Waste-to-Value Chain
A network of community collection hubs provides local residents with financial incentives for separating plastic bottles, tin cans, and organic waste. The collected materials are then consolidated, washed, and shredded into industrial pellets.

#### Corporate Green Alliances
Leading consumer goods companies are partnering with these recycling startups to incorporate recycled plastic (rPET) into their product packaging, supporting corporate sustainability targets.

#### Environmental and Economic Returns
This decentralized waste collection model is reducing plastic pollution in Port Harcourt\'s fragile wetland channels while creating hundreds of jobs for local collectors. This initiative demonstrates that environmental stewardship and economic growth can go hand in hand.`,
        coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  }
};
