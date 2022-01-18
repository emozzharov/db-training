'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
        SELECT
            OrderID as "Order Id",
            SUM(UnitPrice * Quantity) as "Order Total Price",
            ROUND(SUM(Discount * Quantity)/SUM(UnitPrice * Quantity) * 100) as "Total Order Discount, %"
        FROM
            OrderDetails
        GROUP BY OrderID
        ORDER BY OrderID DESC;
    `);
    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
        SELECT
            CustomerID as "CustormerId",
            CompanyName as "CompanyName"
        FROM
            Customers
        WHERE
            Country = 'USA' AND Fax IS NULL
    `);
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        SELECT
            CustomerID as "CustormerId",
            COUNT(OrderID) AS "Total number of Orders",
            COUNT(OrderID) / (SELECT COUNT(*) FROM Orders) * 100 as "% of all orders"
        FROM
            Orders
        GROUP BY CustomerID
        ORDER BY of "all orders" DESC , CustomerID;
    `);
    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        SELECT
            ProductId,
            ProductName,
            QuantityPerUnit
        FROM
            Products
        WHERE
            ProductName RLIKE '^A|^B|^C|^D|^E|^F'
        ORDER BY ProductName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        SELECT
            P.ProductName as "ProductName",
            C.CategoryName as "CategoryName",
            S.CompanyName as "SupplierCompanyName"
        FROM
            Products
        JOIN
            Categories ON P.CategoryID=C.CategoryID
        JOIN
            Suppliers ON P.SupplierID=S.SupplierID);
        ORDER BY P.ProductName, S.CompanyName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT
            E.EmployeeID as "EmployeeId",
            CONCAT(E.FirstName, ' ', E.LastName) as "FullName",
            IFNULL((select FullName from employees where E.ReportsTo = EmployeeID), '-') as "ReportsTo"
        FROM 
            Employees E
        ORDER BY E.EmployeeID
        
          
    `);
    return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
        SELECT
	        C.CategoryName as "CategoryName",
            COUNT(P.ProductName) as "TotalNumberOfProducts"
        FROM
            Categories C
        JOIN
            Products P on P.CategoryID = C.CategoryID
        group by C.CategoryID
        order by C.CategoryName
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT
            CustomerID,
            ContactName
        FROM
            Customers
        WHERE
            ContactName LIKE 'F__n%';
    `);
    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT
            ProductID,
            ProductName
        FROM
            Products
        WHERE
            Discontinued = 1;
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT
            ProductName,
            UnitPrice
        FROM
            Products
        WHERE
            UnitPrice BETWEEN 5 AND 15
        ORDER BY UnitPrice , ProductName
    `);
    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        SELECT
            ProductName,
            UnitPrice
        FROM
            Products
        ORDER BY UnitPrice DESK
        LIMIT 20)
        ORDER BY UnitPrice
    `);
    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        SELECT
            COUNT(*) as "TotalOfCurrentProducts",
            (SELECT COUNT(*) FROM Products WHERE Discontinued = 1) as "TotalOfDiscontinuedProducts"
        FROM products          
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT
            ProductName,
            UnitsOnOrder,
            UnitsInStock
        FROM
            Products
        WHERE
            UnitsOnOrder > UnitsInStock
    `);
    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT
            SUM(MONTH(OrderDate) = 1 ) as "January",
            SUM(MONTH(OrderDate) = 2 ) as "February",
            SUM(MONTH(OrderDate) = 3 ) as "March",
            SUM(MONTH(OrderDate) = 4 ) as "April",
            SUM(MONTH(OrderDate) = 5 ) as "May",
            SUM(MONTH(OrderDate) = 6 ) as "June",
            SUM(MONTH(OrderDate) = 7 ) as "July",
            SUM(MONTH(OrderDate) = 8 ) as "August",
            SUM(MONTH(OrderDate) = 9 ) as "September",
            SUM(MONTH(OrderDate) = 10 ) as "October",
            SUM(MONTH(OrderDate) = 11 ) as "November",
            SUM(MONTH(OrderDate) = 12 ) as "December"
        FROM
            Orders
        WHERE
            YEAR(OrderDate) = 1997
    `);
    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT
            OrderID,
            CustomerID,
            ShipCountry
        FROM
            Orders
        WHERE
            ShipPostalCode IS NOT NULL
    `);
    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT
            C.CategoryName AS "CategoryName",
            AVG(P.UnitPrice) AS "AvgPrice"
        FROM
            Categories C
        JOIN Products P on P.CategoryID = C.CategoryID
        GROUP BY C.CategoryID
        ORDER BY AVG(P.UnitPrice) DESC, C.CategoryName
    `);
    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT
            Date_Format (OrderDate, '%Y-%m-%d %T') as "OrderDate",
            Count(*) as "Total Number of Orders"
        FROM
            Orders
        WHERE
            YEAR(OrderDate) = 1998
        GROUP BY OrderDate
    `);
    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
        SELECT
            C.CustomerID as "CustomerID",
            C.CompanyName as "CompanyName",
            SUM(D.UnitPrice * D.Quantity) as "TotalOrdersAmount, $"
        FROM
            Customers C
        JOIN Orders Ord ON Ord.CustomerID = C.CustomerID
        JOIN orderdetails D ON D.OrderID = Ord.OrderID
        GROUP BY C.CustomerID
        HAVING SUM(D.UnitPrice*del.Quantity)>= 10000
        ORDER BY SUM(D.UnitPrice * D.Quantity) DESC,C.CustomerID
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
        SELECT
            E.EmployeeID as "EmployeeID",
            CONCAT(E.FirstName," ",E.LastName) as "Employee Full Name",
            SUM(D.UnitPrice * D.Quantity) as "Amount, $"
        FROM employees E
        JOIN Orders Ord ON Ord.EmployeeID = E.EmployeeID
        JOIN Orderdetails D ON D.OrderID = Ord.OrderID
        GROUP BY E.EmployeeID
        ORDER BY SUM(D.UnitPrice * D.Quantity) DESC
        LIMIT 1
    `);
    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
        SELECT
            OrderID,
            SUM(UnitPrice * Quantity) as "Maximum Purchase Amount, $"
        FROM
            Orderdetails
        GROUP BY OrderID
        ORDER BY SUM(UnitPrice * Quantity) DESC
        LIMIT 1
    `);
    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
        SELECT
            C.CompanyName,
            P.ProductName,
            ORD.UnitPrice AS "PricePerItem"
        FROM
            Customers C
        JOIN Orders ORD ON ORD.CustomerID = C.CustomerID
        JOIN Orderdetails ORD ON ORD.OrderID = O.OrderID
        JOIN Products P ON P.ProductID = ORD.ProductID
        WHERE
            ORD.UnitPrice = (SELECT MAX(ORD.UnitPrice))
        ORDER BY PricePerItem DESC , CompanyName , ProductName
    `);
    return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
